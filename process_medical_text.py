from transformers import AutoTokenizer
from datasets import Dataset
import re

def preprocess_text(text):
    """
    Preprocess the medical text by splitting it into sentences
    and cleaning the text.
    """
    # Split text into sentences using simple rules
    # Split on period followed by space and newline
    sentences = re.split(r'[.]\s+|\n+', text)
    
    # Basic cleaning
    processed_sentences = [
        sentence.strip()
        for sentence in sentences
        if len(sentence.strip()) > 0
    ]
    
    return processed_sentences

def create_tokenized_dataset(text, model_name="emilyalsentzer/Bio_ClinicalBERT", max_length=128):
    """
    Create a tokenized dataset from input text using Bio_ClinicalBERT tokenizer.
    
    Args:
        text (str): Input medical text
        model_name (str): Name of the pretrained model to use
        max_length (int): Maximum sequence length for tokenization
        
    Returns:
        datasets.Dataset: Tokenized dataset
    """
    # Initialize tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    # Process text into sentences
    processed_sentences = preprocess_text(text)
    
    # Create dataset
    dataset = Dataset.from_dict({"text": processed_sentences})
    
    # Define tokenization function
    def tokenize_function(examples):
        return tokenizer(
            examples["text"],
            padding="max_length",
            truncation=True,
            max_length=max_length,
            return_tensors="pt"
        )
    
    # Tokenize dataset
    tokenized_datasets = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset.column_names
    )
    
    return tokenized_datasets

if __name__ == "__main__":
    # Example usage
    sample_text = """
    Patient presents with elevated blood pressure of 140/90 mmHg.
    Blood glucose levels are at 126 mg/dL, indicating potential diabetes.
    The patient reports occasional chest pain and shortness of breath.
    """
    
    # Create tokenized dataset
    tokenized_data = create_tokenized_dataset(sample_text)
    print("\nDataset info:")
    print(tokenized_data)
    
    # Print first example
    print("\nFirst tokenized example:")
    print(tokenized_data[0]) 