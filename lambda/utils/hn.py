import requests
from aws_lambda_powertools import Logger

logger = Logger()

def fetch_posts(query, limit=20):
    url = f"https://hn.algolia.com/api/v1/search?query={query}&hitsPerPage={limit}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        posts = []
        for hit in data.get("hits", []):
            posts.append({
                "title": hit.get("title") or hit.get("story_title"),
                "url": hit.get("url") or hit.get("story_url"),
                "points": hit.get("points", 0),
                "created": hit.get("created_at")
            })
        logger.info(f"Fetched {len(posts)} Hacker News posts for query: '{query}'")
        return posts
    except requests.RequestException as e:
        logger.exception(f"Failed to fetch Hacker News posts for query: '{query}'")
        return []
    except ValueError:
        logger.exception("Invalid JSON received from Hacker News API")
        return []