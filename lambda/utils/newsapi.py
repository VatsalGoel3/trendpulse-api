import os
import json
import requests
import boto3
from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError

logger = Logger()
_secrets_client = boto3.client("secretsmanager")
_api_key = None

def get_newsapi_key():
    global _api_key
    if _api_key:
        return _api_key
    secret_name = os.getenv("NEWSAPI_SECRET_NAME")
    try:
        secret_response = _secrets_client.get_secret_value(SecretId=secret_name)
        secret_string = secret_response["SecretString"]
        secret = json.loads(secret_string) if secret_string.startswith("{") else {"api_key": secret_string}
        _api_key = secret["api_key"]
        logger.info("NewsAPI key loaded from Secrets Manager")
        return _api_key
    except ClientError as e:
        logger.exception("Error fetching NewsAPI secret from Secrets Manager")
        raise e
    except (json.JSONDecodeError, KeyError) as e:
        logger.exception("NewsAPI secret is malformed")
        raise e

def fetch_articles(query, limit=20):
    try:
        api_key = get_newsapi_key()
        url = f"https://newsapi.org/v2/everything?q={query}&pageSize={limit}&sortBy=relevancy&apiKey={api_key}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        articles = [
            {
                "title": art.get("title"),
                "url": art.get("url"),
                "publishedAt": art.get("publishedAt")
            }
            for art in data.get("articles", [])
        ]
        logger.info(f"Fetched {len(articles)} news articles for query: '{query}'")
        return articles
    except requests.RequestException as e:
        logger.exception(f"Failed to fetch NewsAPI articles for query: '{query}'")
        return []
    except ValueError:
        logger.exception("Invalid JSON received from NewsAPI")
        return []