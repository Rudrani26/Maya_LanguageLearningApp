import torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
import soundfile as sf
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

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
        if not description:
            description = (
                "A female speaker with a neutral accent delivers a clear and moderately paced speech."
            )

        logging.info(f"Tokenizing description and text for TTS generation.")
        
        # Tokenize description and text
        description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
        description_input_ids = description_tokenizer(description, return_tensors="pt").to(device)
        prompt_input_ids = tokenizer(text, return_tensors="pt").to(device)

        logging.info("Generating TTS audio...")
        
        # Generate speech
        generation = model.generate(
            input_ids=description_input_ids.input_ids,
            attention_mask=description_input_ids.attention_mask,
            prompt_input_ids=prompt_input_ids.input_ids,
            prompt_attention_mask=prompt_input_ids.attention_mask,
        )

        # Convert output to audio array
        audio_arr = generation.cpu().numpy().squeeze()

        output_path = "output_audio.wav"
        sf.write(output_path, audio_arr, model.config.sampling_rate)

        logging.info(f"TTS audio saved to {output_path}")
        return output_path

    except Exception as e:
        logging.error(f"Error generating TTS audio: {str(e)}")
        raise RuntimeError(f"Error generating TTS audio: {str(e)}")
