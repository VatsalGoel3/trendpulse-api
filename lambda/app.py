import json
import concurrent.futures
from aws_lambda_powertools import Logger, Metrics, Tracer
from aws_lambda_powertools.metrics import MetricUnit
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler import APIGatewayRestResolver
from utils import reddit, hn, newsapi, sentiment, trends

logger = Logger(service="trendpulse-api")
tracer = Tracer(service="trendpulse-api")
metrics = Metrics(namespace="TrendPulse", service="trendpulse-api")

app = APIGatewayRestResolver()


def process_source(source_func, query, limit):
    try:
        return source_func(query, limit)
    except Exception as e:
        logger.exception(f"Error processing source function: {source_func.__name__}")
        return []


@app.get("/enrich")
@tracer.capture_method
def enrich_data():
    query = app.current_event.get_query_string_value("query")
    if not query:
        logger.error("Missing 'query' parameter")
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Missing 'query' parameter"})
        }
    
    logger.info(f"Processing query: {query}")
    limit = 20

    try:
        # Fetch data concurrently
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_reddit = executor.submit(process_source, reddit.fetch_posts, query, limit)
            future_hn = executor.submit(process_source, hn.fetch_posts, query, limit)
            future_news = executor.submit(process_source, newsapi.fetch_articles, query, limit)
            reddit_results = future_reddit.result()
            hn_results = future_hn.result()
            news_results = future_news.result()

        # Process sentiment analysis concurrently
        def apply_sentiment(item, text_extractor):
            try:
                text = text_extractor(item)
                item["sentiment"] = sentiment.analyze_sentiment(text)
            except Exception as e:
                logger.exception("Sentiment processing failed")
                item["sentiment"] = {"label": "Neutral", "score": 0.0}

        with concurrent.futures.ThreadPoolExecutor() as executor:
            for items, extractor in [
                (reddit_results, lambda i: i.get("title", "")),
                (hn_results, lambda i: i.get("title", "")),
                (news_results, lambda i: f"{i.get('title', '')} {i.get('description', '')}".strip())
            ]:
                futures = [executor.submit(apply_sentiment, item, extractor) for item in items]
                concurrent.futures.wait(futures)

        # Analyze trends with additional statistics
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
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps(response)
        }
    except Exception as e:
        logger.exception("Unhandled error during enrich")
        metrics.add_metric(name="EnrichFailure", unit=MetricUnit.Count, value=1)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Internal server error"})
        }


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST)
@tracer.capture_lambda_handler

def lambda_handler(event, context):
    return app.resolve(event, context)