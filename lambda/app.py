import os
import json
from aws_lambda_powertools import Logger, Metrics, Tracer
from aws_lambda_powertools.event_handler import APIGatewayRestResolver
from aws_lambda_powertools.metrics import MetricUnit
from utils import reddit, hn, newsapi

logger = Logger()
tracer = Tracer()
metrics = Metrics(namespace="TrendPulse")
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

        response = {
            "query": query,
            "reddit": reddit_results,
            "hackernews": hn_results,
            "news": news_results
        }

        logger.info("Successfully fetched and structured data")
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

@logger.inject_lambda_context
@tracer.capture_lambda_handler
@metrics.log_metrics
def lambda_handler(event, context):
    return app.resolve(event, context)
