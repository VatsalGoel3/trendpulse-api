import json
from aws_lambda_powertools import Logger, Metrics, Tracer
from aws_lambda_powertools.metrics import MetricUnit
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler import APIGatewayRestResolver
from utils import reddit, hn, newsapi, sentiment, trends

logger = Logger(service="trendpulse-api")
tracer = Tracer(service="trendpulse-api")
metrics = Metrics(namespace="TrendPulse", service="trendpulse-api")

app = APIGatewayRestResolver()


@app.get("/enrich")
@tracer.capture_method
def enrich_data():
    query = app.current_event.get_query_string_value("query")

    if not query:
        logger.error("Missing 'query' parameter")
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": "Missing 'query' parameter"})
        }

    logger.info(f"Processing query: {query}")

    try:
        reddit_results = reddit.fetch_posts(query)
        hn_results = hn.fetch_posts(query)
        news_results = newsapi.fetch_articles(query)

        # Sentiment Analysis
        for item in reddit_results:
            item["sentiment"] = sentiment.analyze_sentiment(item.get("title", ""))

        for item in hn_results:
            item["sentiment"] = sentiment.analyze_sentiment(item.get("title", ""))

        for item in news_results:
            title = item.get("title", "")
            description = item.get("description", "")
            item["sentiment"] = sentiment.analyze_sentiment(f"{title} {description}".strip())

        # Trend Analysis
        trends_summary = {
            "reddit": trends.calculate_trends(reddit_results),
            "hackernews": trends.calculate_trends(hn_results),
            "news": trends.calculate_trends(news_results)
        }

        response = {
            "query": query,
            "trends": trends_summary,
            "reddit": reddit_results,
            "hackernews": hn_results,
            "news": news_results
        }

        logger.info("Successfully fetched, enriched data, and calculated trends")
        metrics.add_metric(name="EnrichSuccess", unit=MetricUnit.Count, value=1)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(response)
        }

    except Exception as e:
        logger.exception("Unhandled error during enrich")
        metrics.add_metric(name="EnrichFailure", unit=MetricUnit.Count, value=1)

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": "Internal server error"})
        }


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    return app.resolve(event, context)