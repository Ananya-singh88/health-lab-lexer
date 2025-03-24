import json
import os
import torch
import argparse
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForMaskedLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling


def load_medical_reports(json_dir):
    """Load medical report data from JSON files in the specified directory
    
    Args:
        json_dir: Path to the directory containing JSON files with medical report data
        
    Returns:
        A Dataset object containing the texts for fine-tuning
    """
    all_texts = []
    
    # Get all JSON files in the directory
    json_files = [f for f in os.listdir(json_dir) if f.endswith('.json')]
    print(f"Found {len(json_files)} JSON files in {json_dir}")
    
    for json_file in json_files:
        file_path = os.path.join(json_dir, json_file)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Extract content from each page in the JSON
            if isinstance(data, list):
                for item in data:
                    if "content" in item:
                        all_texts.append(item["content"])
            
            print(f"Processed {json_file}: extracted {len(all_texts)} texts")
        except Exception as e:
            print(f"Error processing {json_file}: {str(e)}")
    
    print(f"Total texts extracted: {len(all_texts)}")
    return Dataset.from_dict({"text": all_texts})


def fine_tune_biobert(json_dir, output_dir="fine_tuned_biobert", epochs=3, batch_size=8, learning_rate=5e-5):
    """Fine-tune the Bio_ClinicalBERT model on custom medical data
    
    Args:
        json_dir: Path to the directory containing JSON files with medical report data
        output_dir: Directory to save the fine-tuned model (relative to current directory)
        epochs: Number of training epochs
        batch_size: Training batch size
        learning_rate: Learning rate for training
        
    Returns:
        Path to the saved model
    """
    print(f"Loading medical report data from {json_dir}...")
    dataset = load_medical_reports(json_dir)
    print(f"Loaded {len(dataset)} text samples")
    
    # Load Pretrained Bio_ClinicalBERT Model and Tokenizer
    print("Loading Bio_ClinicalBERT model and tokenizer...")
    model_name = "emilyalsentzer/Bio_ClinicalBERT"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForMaskedLM.from_pretrained(model_name)
    
    # Tokenize the dataset
    print("Tokenizing dataset...")
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=256)

    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    # Split dataset into train and evaluation sets (80/20 split)
    tokenized_dataset = tokenized_dataset.train_test_split(test_size=0.2)
    
    # Data Collator for Masked Language Modeling (MLM)
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer, mlm=True, mlm_probability=0.15
    )
    
    # Clean up existing checkpoints and create output directory
    output_dir = os.path.abspath(output_dir)
    import shutil
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)
    
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
        save_total_limit=1,
        report_to="none",
        load_best_model_at_end=True,
        overwrite_output_dir=True
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
        test_text = "The patient's hemoglobin level was [MASK] g/dL, which is within normal range."
    
    print(f"Testing model with: {test_text}")
    predictions = nlp(test_text)
    
    # Print predictions
    print("\nTop predictions:")
    for pred in predictions:
        print(f"- {pred['token_str']}: {pred['score']:.4f}")
    
    return predictions


def main():
    parser = argparse.ArgumentParser(description="Fine-tune Bio_ClinicalBERT on medical report data")
    parser.add_argument("--json_dir", type=str, default="Fine-Tune-Model", 
                        help="Path to the directory containing JSON files with medical reports")
    parser.add_argument("--output_dir", type=str, default="fine_tuned_biobert", 
                        help="Directory to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=5e-5, help="Learning rate")
    parser.add_argument("--test", action="store_true", help="Test the model after fine-tuning")
    parser.add_argument("--test_text", type=str, help="Text to test the model with")
    
    args = parser.parse_args()
    
    # Fine-tune the model
    model_path = fine_tune_biobert(
        args.json_dir,
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