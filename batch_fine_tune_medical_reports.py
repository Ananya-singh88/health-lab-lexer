import os
import json
import argparse
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForMaskedLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from biobert_processor import BioBertProcessor

def load_medical_reports_from_directory(json_dir):
    """
    Load medical report data from all JSON files in the specified directory
    
    Args:
        json_dir: Path to the directory containing JSON files with medical report data
        
    Returns:
        A Dataset object containing the texts for fine-tuning
    """
    all_texts = []
    current_count = 0
    
    # Get all JSON files in the directory
    json_files = [f for f in os.listdir(json_dir) if f.endswith('.json')]
    print(f"Found {len(json_files)} JSON files in {json_dir}")
    
    for json_file in json_files:
        file_path = os.path.join(json_dir, json_file)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Extract content based on file structure
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        # Handle training data format
                        if "input" in item:
                            all_texts.append(item["input"])
                        # Handle content-based format
                        elif "content" in item:
                            all_texts.append(item["content"])
            
            new_count = len(all_texts) - current_count
            print(f"Processed {json_file}: added {new_count} texts")
            current_count = len(all_texts)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error in {json_file}: {str(e)}")
        except Exception as e:
            print(f"Error processing {json_file}: {str(e)}")
    
    if not all_texts:
        raise ValueError("No valid training texts found in the provided JSON files")
    
    print(f"Total texts extracted: {len(all_texts)}")
    return Dataset.from_dict({"text": all_texts})

def fine_tune_biobert_batch(json_dir, output_dir="./fine_tuned_biobert_batch", epochs=3, batch_size=8, learning_rate=5e-5):
    """
    Fine-tune the Bio_ClinicalBERT model on multiple medical report JSON files
    
    Args:
        json_dir: Path to the directory containing JSON files with medical report data
        output_dir: Directory to save the fine-tuned model
        epochs: Number of training epochs
        batch_size: Training batch size
        learning_rate: Learning rate for training
        
    Returns:
        Path to the saved model
    """
    print(f"Loading medical report data from {json_dir}...")
    dataset = load_medical_reports_from_directory(json_dir)
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
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Clean up any existing temporary checkpoints
    import shutil
    for item in os.listdir(output_dir):
        if item.startswith('tmp-checkpoint-'):
            tmp_path = os.path.join(output_dir, item)
            try:
                shutil.rmtree(tmp_path, ignore_errors=True)
            except Exception as e:
                print(f"Warning: Could not remove temporary checkpoint {tmp_path}: {e}")
    
    # Training Arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="steps",
        eval_steps=5,
        save_strategy="steps",
        save_steps=5,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=epochs,
        logging_dir=os.path.join(output_dir, "logs"),
        learning_rate=learning_rate,
        weight_decay=0.01,
        save_total_limit=1,
        report_to="none",
        load_best_model_at_end=True,
        hub_strategy="end",
        save_safetensors=True,
        overwrite_output_dir=True,
        save_only_model=True
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
    
    # Create a unique temporary directory for this run
    import tempfile
    import uuid
    temp_base = tempfile.gettempdir()
    temp_run_dir = os.path.join(temp_base, f"biobert_train_{uuid.uuid4().hex}")
    os.makedirs(temp_run_dir, exist_ok=True)
    
    # Update training arguments to use temporary directory
    training_args.output_dir = temp_run_dir
    
    try:
        # Run training
        trainer.train()
        
        # Save final model
        print(f"Saving fine-tuned model to {output_dir}...")
        
        # Create a temporary directory for saving
        temp_save_dir = os.path.join(temp_base, f"biobert_save_{uuid.uuid4().hex}")
        os.makedirs(temp_save_dir, exist_ok=True)
        
        # Save model and tokenizer to temporary directory first
        trainer.save_model(temp_save_dir)
        tokenizer.save_pretrained(temp_save_dir)
        
        # Remove existing output directory if it exists
        if os.path.exists(output_dir):
            try:
                shutil.rmtree(output_dir)
            except Exception as e:
                print(f"Warning: Could not remove existing output directory: {e}")
                # If we can't remove it, try to save to a new directory
                output_dir = f"{output_dir}_{uuid.uuid4().hex[:8]}"
        
        # Move the temporary directory to final location
        try:
            shutil.move(temp_save_dir, output_dir)
        except Exception as e:
            print(f"Warning: Could not move model to final location: {e}")
            # If move fails, try to copy instead
            shutil.copytree(temp_save_dir, output_dir)
            shutil.rmtree(temp_save_dir, ignore_errors=True)
        
        print(f"✅ Fine-tuning complete! Model saved at '{output_dir}'")
    except Exception as e:
        print(f"Error during training or saving: {e}")
        raise
    finally:
        # Clean up temporary directories
        for temp_dir in [temp_run_dir, temp_save_dir]:
            try:
                if os.path.exists(temp_dir):
                    shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception as e:
                print(f"Warning: Could not clean up temporary directory {temp_dir}: {e}")
    
    return output_dir

def integrate_fine_tuned_model(model_path):
    """
    Integrate the fine-tuned model with the BioBertProcessor
    
    Args:
        model_path: Path to the fine-tuned model
        
    Returns:
        An instance of BioBertProcessor with the fine-tuned model loaded
    """
    # Initialize the BioBertProcessor
    print("Initializing BioBertProcessor...")
    processor = BioBertProcessor()
    
    # Load the fine-tuned model
    print(f"Loading the fine-tuned model from {model_path}...")
    processor.load_fine_tuned_model(model_path)
    
    # Test the model with a sample text
    print("Testing the fine-tuned model...")
    test_text = "Patient's lab results show glucose: 120 mg/dL, cholesterol: 190 mg/dL, HDL: 45 mg/dL."
    
    print("Extracting metrics with the fine-tuned model:")
    metrics = processor.extract_metrics_with_bert(test_text)
    for metric in metrics:
        print(f"  - {metric['name']}: {metric['value']} {metric['unit']} (source: {metric['source']})")
    
    print("✅ Fine-tuning and integration complete!")
    return processor

def test_fine_tuned_model(model_path, test_text=None):
    """
    Test the fine-tuned model with a sample text
    
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
    parser = argparse.ArgumentParser(description="Fine-tune Bio_ClinicalBERT on multiple medical report JSON files")
    parser.add_argument("--json_dir", type=str, default="./Fine-Tune-Model", 
                        help="Path to the directory containing JSON files with medical report data")
    parser.add_argument("--output_dir", type=str, default="./fine_tuned_biobert_batch", 
                        help="Directory to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=5e-5, help="Learning rate")
    parser.add_argument("--test", action="store_true", help="Test the model after fine-tuning")
    parser.add_argument("--test_text", type=str, help="Text to test the model with")
    parser.add_argument("--integrate", action="store_true", help="Integrate the model with BioBertProcessor")
    
    args = parser.parse_args()
    
    # Fine-tune the model
    model_path = fine_tune_biobert_batch(
        args.json_dir,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate
    )
    
    # Test the model if requested
    if args.test:
        test_fine_tuned_model(model_path, args.test_text)
    
    # Integrate with BioBertProcessor if requested
    if args.integrate:
        integrate_fine_tuned_model(model_path)

if __name__ == "__main__":
    main()