import azure.functions as func
import logging
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs


def get_video_id(url):
    # Extract video ID from YouTube URL
    parsed_url = urlparse(url)
    if parsed_url.hostname in ("www.youtube.com", "youtube.com"):
        return parse_qs(parsed_url.query)["v"][0]
    elif parsed_url.hostname == "youtu.be":
        return parsed_url.path[1:]
    raise ValueError("Invalid YouTube URL")


def fetch_transcript(url):
    video_id = get_video_id(url)
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)

    # Format transcript as a string
    transcript = "\n".join(
        f"[{entry['start']:.2f}] {entry['text']}" for entry in transcript_list
    )
    return transcript


app = func.FunctionApp()


@app.timer_trigger(
    schedule="0 */1 * * * *",
    arg_name="myTimer",
    run_on_startup=True,
    use_monitor=False,
)
def DailyTimerTrigger(myTimer: func.TimerRequest) -> None:
    logging.info("Starting Daily Transcript Parsing Function...")

    # Example YouTube URL (replace with your desired URL)
    youtube_url = "https://www.youtube.com/watch?v=UkwjiYzNRw8"

    try:
        logging.info(f"Attempting to get fetch transcript from: {youtube_url}")
        transcript = fetch_transcript(youtube_url)
        logging.info("Transcript fetched successfully:")
        logging.info(transcript)
    except Exception as e:
        logging.error(f"Failed to fetch transcript: {e}")
