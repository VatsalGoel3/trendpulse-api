from aws_lambda_powertools import Logger
from datetime import datetime
from dateutil.parser import parse as parse_date
import statistics

logger = Logger()

def calculate_trends(items):
    """
    Calculate trend metrics for a list of items.
    Returns frequency, latest timestamp, overall sentiment, and sentiment variation.
    """
    try:
        if not items:
            return {
                "frequency": 0,
                "latest": None,
                "overall_sentiment": "Neutral",
                "sentiment_std": 0.0
            }
        
        frequency = len(items)
        timestamps = []
        for item in items:
            ts = item.get("created") or item.get("publishedAt")
            if isinstance(ts, (float, int)):
                timestamps.append(datetime.utcfromtimestamp(ts))
            elif isinstance(ts, str):
                try:
                    timestamps.append(parse_date(ts))
                except Exception:
                    logger.warning(f"Invalid timestamp string skipped: {ts}")
        latest = max(timestamps).isoformat() if timestamps else None

        sentiment_scores = [
            item["sentiment"].get("score", 0.0)
            for item in items
            if item.get("sentiment") and isinstance(item["sentiment"], dict)
        ]
        if sentiment_scores:
            avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
            std_sentiment = statistics.stdev(sentiment_scores) if len(sentiment_scores) > 1 else 0.0
        else:
            avg_sentiment = 0.0
            std_sentiment = 0.0

        if avg_sentiment > 0.1:
            overall_sentiment = "Positive"
        elif avg_sentiment < -0.1:
            overall_sentiment = "Negative"
        else:
            overall_sentiment = "Neutral"

        return {
            "frequency": frequency,
            "latest": latest,
            "overall_sentiment": overall_sentiment,
            "sentiment_std": round(std_sentiment, 4)
        }
    except Exception as e:
        logger.exception("Error calculating trend insights")
        return {
            "frequency": 0,
            "latest": None,
            "overall_sentiment": "Neutral",
            "sentiment_std": 0.0
        }