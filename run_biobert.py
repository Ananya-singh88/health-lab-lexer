# Load model directly
from transformers import AutoTokenizer, AutoModel
import torch

print("Loading Bio_ClinicalBERT model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
print("Model loaded successfully!")

# Test the model with a sample medical text
sample_text = "Patient has glucose level of 120 mg/dL and blood pressure of 130/85 mmHg."
print(f"\nSample text: {sample_text}")

# Tokenize and get model outputs
inputs = tokenizer(sample_text, return_tensors="pt")
with torch.no_grad():
    outputs = model(**inputs)

# Get the embeddings from the last hidden state
embeddings = outputs.last_hidden_state
print(f"\nEmbedding shape: {embeddings.shape}")
print(f"First token embedding (first 5 values): {embeddings[0][0][:5]}")

print("\nModel is working correctly!")