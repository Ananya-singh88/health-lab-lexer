#!/usr/bin/env python3

import os
import argparse
from batch_fine_tune_medical_reports import fine_tune_biobert_batch, integrate_fine_tuned_model, test_fine_tuned_model

def main():
    """
    Run the batch fine-tuning process on all JSON files in the Fine-Tune-Model directory
    and integrate the fine-tuned model with the BioBertProcessor
    """
    parser = argparse.ArgumentParser(description="Run batch fine-tuning on medical report JSON files")
    parser.add_argument("--json_dir", type=str, default="./Fine-Tune-Model", 
                        help="Path to the directory containing JSON files with medical report data")
    parser.add_argument("--output_dir", type=str, default="./fine_tuned_biobert_batch", 
                        help="Directory to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=5e-5, help="Learning rate")
    parser.add_argument("--test", action="store_true", help="Test the model after fine-tuning")
    parser.add_argument("--test_text", type=str, 
                        help="Text to test the model with (default: 'The patient's hemoglobin level was [MASK] g/dL, which is within normal range.')")
    parser.add_argument("--integrate", action="store_true", help="Integrate the model with BioBertProcessor")
    
    args = parser.parse_args()
    
    # Ensure the JSON directory exists
    if not os.path.exists(args.json_dir):
        print(f"Error: JSON directory '{args.json_dir}' does not exist.")
        return
    
    # Check if there are JSON files in the directory
    json_files = [f for f in os.listdir(args.json_dir) if f.endswith('.json')]
    if not json_files:
        print(f"Error: No JSON files found in '{args.json_dir}'.")
        return
    
    print(f"Found {len(json_files)} JSON files in '{args.json_dir}'.")
    print("Starting batch fine-tuning process...")
    
    # Fine-tune the model on all JSON files in the directory
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
        processor = integrate_fine_tuned_model(model_path)
        print("\nThe fine-tuned model has been successfully integrated with BioBertProcessor.")
        print("You can now use the BioBertProcessor to analyze medical reports with improved accuracy.")
    
    print("\n✅ Batch fine-tuning process completed successfully!")
    print(f"The fine-tuned model is saved at: {model_path}")
    print("\nTo use the fine-tuned model for medical report analysis, run:")
    print(f"python -c \"from biobert_processor import BioBertProcessor; processor = BioBertProcessor(); processor.load_fine_tuned_model('{model_path}')\"")

if __name__ == "__main__":
    main()