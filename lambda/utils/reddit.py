import os
import json
import praw
import boto3
from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError
from praw.exceptions import PRAWException

logger = Logger()

# Cache clients to avoid re-instantiating on every Lambda invocation
_secrets_client = boto3.client("secretsmanager")
_reddit_client = None

def get_reddit_client():
    global _reddit_client
    if _reddit_client:
        return _reddit_client

    secret_name = os.getenv("REDDIT_SECRET_NAME")

    try:
        secret_response = _secrets_client.get_secret_value(SecretId=secret_name)
        credentials = json.loads(secret_response["SecretString"])

        _reddit_client = praw.Reddit(
            client_id=credentials["client_id"],
            client_secret=credentials["client_secret"],
            user_agent="TrendPulseAPI"
        )

        logger.info("Initialized Reddit client successfully")
        return _reddit_client

    except ClientError as e:
        logger.exception("AWS Secrets Manager error")
        raise e
    except (json.JSONDecodeError, KeyError) as e:
        logger.exception("Invalid secret format for Reddit credentials")
        raise e
    except PRAWException as e:
        logger.exception("Error initializing Reddit client")
        raise e

def fetch_posts(query, limit=5):
    try:
        reddit = get_reddit_client()
        posts = []

        for submission in reddit.subreddit("all").search(query, limit=limit):
            posts.append({
                "title": submission.title,
                "score": submission.score,
                "url": submission.url,
                "created": submission.created_utc
            })

        logger.info(f"Fetched {len(posts)} Reddit posts for query: '{query}'")
        return posts

    except Exception as e:
        logger.exception(f"Failed to fetch Reddit posts for query: '{query}'")
        return []