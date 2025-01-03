import os
import tempfile

def save_audio(audio_data: bytes) -> str:
    """
    Save the generated audio to a temporary file.
    :param audio_data: The byte data of the audio file
    :return: Path to the saved audio file
    """
    file_path = os.path.join(tempfile.gettempdir(), "output.mp3")
    
    with open(file_path, "wb") as file:
        file.write(audio_data)
    
    return file_path
