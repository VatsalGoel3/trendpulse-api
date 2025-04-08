from aws_lambda_powertools import Logger
from datetime import datetime
from dateutil.parser import parse as parse_date  # More robust ISO parser

logger = Logger()

def calculate_trends(items):
    try:
        if not items:
            return {
                "frequency": 0,
                "latest": None,
                "overall_sentiment": "Neutral"
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
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0

        if avg_sentiment > 0.1:
            overall_sentiment = "Positive"
        elif avg_sentiment < -0.1:
            overall_sentiment = "Negative"
        else:
            overall_sentiment = "Neutral"

        return {
            "frequency": frequency,
            "latest": latest,
            "overall_sentiment": overall_sentiment
        }

    except Exception as e:
        logger.exception("Error calculating trend insights")
        return {
            "frequency": 0,
            "latest": None,
            "overall_sentiment": "Neutral"
        }