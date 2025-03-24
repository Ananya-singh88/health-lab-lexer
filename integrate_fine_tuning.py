import os
import sys
import json
from pathlib import Path

# Add the project root to the path to import the BioBertProcessor
sys.path.append(str(Path(__file__).parent))

# Import the fine-tuning script
from fine_tune_biobert import fine_tune_biobert, test_fine_tuned_model

# Import the BioBertProcessor
from biobert_processor import BioBertProcessor

def integrate_fine_tuned_model(json_file, output_dir="./fine_tuned_bio_clinicalbert", epochs=3, batch_size=8, learning_rate=5e-5):
    """
    Fine-tune the BioBERT model and integrate it with the BioBertProcessor
    
    Args:
        json_file: Path to the JSON file containing medical text data
        output_dir: Directory to save the fine-tuned model
        epochs: Number of training epochs
        batch_size: Training batch size
        learning_rate: Learning rate for training
        
    Returns:
        An instance of BioBertProcessor with the fine-tuned model loaded
    """
    # Step 1: Fine-tune the model
    print("Step 1: Fine-tuning the BioBERT model...")
    model_path = fine_tune_biobert(
        json_file,
        output_dir=output_dir,
        epochs=epochs,
        batch_size=batch_size,
        learning_rate=learning_rate
    )
    
    # Step 2: Initialize the BioBertProcessor
    print("\nStep 2: Initializing BioBertProcessor...")
    processor = BioBertProcessor()
    
    # Step 3: Load the fine-tuned model
    print("\nStep 3: Loading the fine-tuned model into BioBertProcessor...")
    processor.load_fine_tuned_model(model_path)
    
    # Step 4: Test the model with a sample text
    print("\nStep 4: Testing the fine-tuned model...")
    test_text = "Patient's lab results show glucose: 120 mg/dL, cholesterol: 190 mg/dL, HDL: 45 mg/dL."
    
    print("\nExtracting metrics with the fine-tuned model:")
    metrics = processor.extract_metrics_with_bert(test_text)
    for metric in metrics:
        print(f"  - {metric['name']}: {metric['value']} {metric['unit']} (source: {metric['source']})")
    
    print("\n✅ Fine-tuning and integration complete!")
    return processor

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Fine-tune BioBERT and integrate with BioBertProcessor")
    parser.add_argument("--json_file", type=str, default="sample_medical_data.json", 
                        help="Path to the JSON file with medical texts")
    parser.add_argument("--output_dir", type=str, default="./fine_tuned_bio_clinicalbert", 
                        help="Directory to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=5e-5, help="Learning rate")
    
    args = parser.parse_args()
    
    # Fine-tune and integrate
    processor = integrate_fine_tuned_model(
        args.json_file,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate
    )

if __name__ == "__main__":
    main()