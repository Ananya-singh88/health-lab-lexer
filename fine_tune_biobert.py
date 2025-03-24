import json
import torch
import os
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForMaskedLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling


def load_medical_data(json_file):
    """Load medical data from a JSON file
    
    Args:
        json_file: Path to the JSON file containing medical text data
        
    Returns:
        A Dataset object containing the texts
    """
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Adjust based on your JSON structure
    # This assumes each entry in the JSON has a 'text' field
    texts = [entry["text"] for entry in data]
    return Dataset.from_dict({"text": texts})


def fine_tune_biobert(json_file, output_dir="./fine_tuned_bio_clinicalbert", epochs=3, batch_size=8, learning_rate=5e-5):
    """Fine-tune the Bio_ClinicalBERT model on custom medical data
    
    Args:
        json_file: Path to the JSON file containing medical text data
        output_dir: Directory to save the fine-tuned model
        epochs: Number of training epochs
        batch_size: Training batch size
        learning_rate: Learning rate for training
        
    Returns:
        Path to the saved model
    """
    print(f"Loading medical data from {json_file}...")
    dataset = load_medical_data(json_file)
    print(f"Loaded {len(dataset)} text samples")
    
    # Load Pretrained Bio_ClinicalBERT Model and Tokenizer
    print("Loading Bio_ClinicalBERT model and tokenizer...")
    model_name = "emilyalsentzer/Bio_ClinicalBERT"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForMaskedLM.from_pretrained(model_name)
    
    # Tokenize the dataset
    print("Tokenizing dataset...")
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=128)

    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    # Split dataset into train and evaluation sets (80/20 split)
    tokenized_dataset = tokenized_dataset.train_test_split(test_size=0.2)
    
    # Data Collator for Masked Language Modeling (MLM)
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer, mlm=True, mlm_probability=0.15
    )
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Training Arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=epochs,
        logging_dir=os.path.join(output_dir, "logs"),
        learning_rate=learning_rate,
        weight_decay=0.01,
        save_total_limit=2,
        report_to="none",
        load_best_model_at_end=True
    )
    
    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["test"],
        tokenizer=tokenizer,
        data_collator=data_collator
    )
    
    # Fine-Tune the Model
    print("Starting fine-tuning process...")
    trainer.train()
    
    # Save the Model
    print(f"Saving fine-tuned model to {output_dir}...")
    trainer.save_model(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    print(f"✅ Fine-tuning complete! Model saved at '{output_dir}'")
    return output_dir


def test_fine_tuned_model(model_path, test_text=None):
    """Test the fine-tuned model with a sample text
    
    Args:
        model_path: Path to the fine-tuned model
        test_text: Text to test with (will use a default if None)
        
    Returns:
        Model predictions
    """
    from transformers import pipeline
    
    # Load fine-tuned model
    nlp = pipeline("fill-mask", model=model_path, tokenizer=model_path)
    
    # Example usage
    if test_text is None:
        test_text = "The patient was diagnosed with [MASK] based on the blood test results."
    
    print(f"Testing model with: {test_text}")
    predictions = nlp(test_text)
    
    # Print predictions
    print("\nTop predictions:")
    for pred in predictions:
        print(f"- {pred['token_str']}: {pred['score']:.4f}")
    
    return predictions


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Fine-tune Bio_ClinicalBERT on medical data")
    parser.add_argument("--json_file", type=str, required=True, help="Path to the JSON file with medical texts")
    parser.add_argument("--output_dir", type=str, default="./fine_tuned_bio_clinicalbert", help="Directory to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=5e-5, help="Learning rate")
    parser.add_argument("--test", action="store_true", help="Test the model after fine-tuning")
    parser.add_argument("--test_text", type=str, help="Text to test the model with")
    
    args = parser.parse_args()
    
    # Fine-tune the model
    model_path = fine_tune_biobert(
        args.json_file,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate
    )
    
    # Test the model if requested
    if args.test:
        test_fine_tuned_model(model_path, args.test_text)


if __name__ == "__main__":
    main()