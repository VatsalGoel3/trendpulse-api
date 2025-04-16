from aws_lambda_powertools import Logger
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = Logger()

analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text: str) -> dict:
    """
    Lightweight sentiment analysis using VADER.

    Args:
        text (str): Input text to analyze.

    Returns:
        dict: {
            "label": "Positive" | "Neutral" | "Negative",
            "score": float (compound sentiment score)
        }
    """
    try:
        if not text or not text.strip():
            return {"label": "Neutral", "score": 0.0}

        scores = analyzer.polarity_scores(text)
        compound = scores["compound"]

        if compound >= 0.05:
            label = "Positive"
        elif compound <= -0.05:
            label = "Negative"
        else:
            label = "Neutral"

        return {"label": label, "score": round(compound, 4)}
    except Exception as e:
        logger.exception("Sentiment analysis failed")
        return {"label": "Neutral", "score": 0.0}