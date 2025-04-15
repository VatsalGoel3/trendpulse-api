from aws_lambda_powertools import Logger
from transformers import pipeline
from functools import lru_cache

logger = Logger()

@lru_cache(maxsize=1)
def get_sentiment_pipeline():
    try:
        # Load a top-of-the-line model that provides Negative, Neutral, and Positive classifications.
        sentiment_pipe = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment", 
            tokenizer="cardiffnlp/twitter-roberta-base-sentiment",
            device=-1
        )
        logger.info("Sentiment analysis pipeline loaded successfully")
        return sentiment_pipe
    except Exception as e:
        logger.exception("Failed to load sentiment analysis pipeline.")
        raise e

def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment using a transformer-based model for highly accurate sentiment analysis.

    Args:
        text (str): Input text to analyze.

    Returns:
        dict: {
            "label": "Positive" | "Neutral" | "Negative",
            "score": float (confidence score)
        }
    """
    try:
        if not text or not text.strip():
            return {"label": "Neutral", "score": 0.0}
        
        sentiment_pipe = get_sentiment_pipeline()
        # Process text through the sentiment pipeline
        results = sentiment_pipe(text)
        result = results[0]  # Use the top prediction
        label = result.get("label", "Neutral")
        # Normalize model outputs if they return 'LABEL_x' format
        if label.startswith("LABEL_"):
            mapping = {"LABEL_0": "Negative", "LABEL_1": "Neutral", "LABEL_2": "Positive"}
            label = mapping.get(label, "Neutral")
        return {"label": label, "score": round(result.get("score", 0.0), 4)}
    except Exception as e:
        logger.exception(f"Sentiment analysis failed for text: {text[:60]}...")
        return {"label": "Neutral", "score": 0.0}