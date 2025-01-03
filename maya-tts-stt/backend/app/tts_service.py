# tts_service.py

import torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
import soundfile as sf

# Check device
device = "cuda:0" if torch.cuda.is_available() else "cpu"

# Load the model and tokenizer
model_name = "ai4bharat/indic-parler-tts"
model = ParlerTTSForConditionalGeneration.from_pretrained(model_name).to(device)
tokenizer = AutoTokenizer.from_pretrained(model_name)

def generate_tts_audio(text: str, description: str = None) -> str:
    """
    Generate TTS audio from input text.
    Args:
        text (str): The text to convert to speech.
        description (str, optional): Voice characteristics description. Defaults to None.
    Returns:
        str: Path to the generated audio file.
    """
    try:
        # Use a default description if none is provided
        if not description:
            description = (
                "A female speaker with a neutral accent delivers a clear and moderately paced speech."
            )

        # Tokenize description and text
        description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
        description_input_ids = description_tokenizer(description, return_tensors="pt").to(device)
        prompt_input_ids = tokenizer(text, return_tensors="pt").to(device)

        # Generate speech
        generation = model.generate(
            input_ids=description_input_ids.input_ids,
            attention_mask=description_input_ids.attention_mask,
            prompt_input_ids=prompt_input_ids.input_ids,
            prompt_attention_mask=prompt_input_ids.attention_mask,
        )

        # Convert output to audio array
        audio_arr = generation.cpu().numpy().squeeze()

        # Save audio to file and return path
        output_path = "output_audio.wav"  # Default path for saving the audio file
        sf.write(output_path, audio_arr, model.config.sampling_rate)

        return output_path

    except Exception as e:
        raise RuntimeError(f"Error generating TTS audio: {str(e)}")


def save_audio(audio_path: str, save_path: str = "output_audio.mp3"):
    """
    Save the generated audio to a specific path.
    Args:
        audio_path (str): Path to the generated audio file.
        save_path (str): Path to save the audio as MP3. Defaults to "output_audio.mp3".
    """
    try:
        # You can use an audio library like `pydub` to convert .wav to .mp3
        from pydub import AudioSegment

        audio = AudioSegment.from_file(audio_path, format="wav")
        audio.export(save_path, format="mp3")
    except Exception as e:
        raise RuntimeError(f"Error saving audio file: {str(e)}")
