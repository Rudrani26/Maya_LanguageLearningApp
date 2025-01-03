import subprocess
import time

def start_ngrok():
    # Start ngrok as a subprocess to expose the FastAPI app running locally
    process = subprocess.Popen(['ngrok', 'http', '8000'])
    time.sleep(5)  # Wait for ngrok to start and generate a public URL
    print("Ngrok tunnel started.")
    return process
