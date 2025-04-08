from textblob import TextBlob
from aws_lambda_powertools import Logger

logger = Logger()

def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment using TextBlob and return a sentiment label and polarity score.

    Args:
        text (str): Input text to analyze.

    Returns:
        dict: {
            "label": "Positive" | "Neutral" | "Negative",
            "score": float (between -1.0 and 1.0)
        }
    """
    try:
        # Edge case: empty or whitespace-only input
        if not text or not text.strip():
            return {"label": "Neutral", "score": 0.0}

        blob = TextBlob(text)
        polarity = round(blob.sentiment.polarity, 4)

        if polarity > 0.1:
            label = "Positive"
        elif polarity < -0.1:
            label = "Negative"
        else:
            label = "Neutral"

        return {
            "label": label,
            "score": polarity
        }

    except Exception as e:
        logger.exception(f"Sentiment analysis failed for text: {text[:60]}...")
        return {
            "label": "Neutral",
            "score": 0.0
        }