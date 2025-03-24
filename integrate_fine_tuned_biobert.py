import argparse
import os
from transformers import pipeline
from biobert_processor import BioBertProcessor

def integrate_fine_tuned_model():
    """Integrate the fine-tuned BioBERT model with the existing BioBertProcessor
    
    This function loads the fine-tuned model and demonstrates its use for medical text analysis
    """
    # Initialize the BioBertProcessor
    processor = BioBertProcessor()
    
    # Path to the fine-tuned model
    model_path = "/Users/purushothamrj/AI Health Parser/fine_tuned_biobert"
    
    # Load the fine-tuned model
    print(f"Loading fine-tuned model from {model_path}...")
    processor.load_fine_tuned_model(model_path)
    
    # Test the model with a sample medical text
    test_text = """
    Laboratory Test Results:
    Hemoglobin: 14.5 g/dL (Normal range: 13.0 - 16.5)
    RBC Count: 4.79 million/cmm (Normal range: 4.5 - 5.5)
    WBC Count: 10570 /cmm (Normal range: 4000 - 10000)
    Fasting Blood Sugar: 141.0 mg/dL (Normal range: 74 - 106)
    HbA1c: 7.10 % (Good Control: 6.0-7.0 %)
    Cholesterol: 189.0 mg/dL (Desirable: <200)
    Triglyceride: 168.0 mg/dL (Normal: <150)
    HDL Cholesterol: 60.0 mg/dL (High: >60.0)
    LDL: 100.39 mg/dL (Optimal: <100)
    """
    
    print("\nExtracting medical metrics using fine-tuned model...")
    metrics = processor.extract_metrics_with_bert(test_text)
    
    # Display the extracted metrics
    print("\nExtracted Metrics:")
    for metric in metrics:
        print(f"- {metric['name']}: {metric['value']} {metric['unit']}")
    
    # Determine the report category
    category = processor.determine_report_category(test_text, metrics)
    print(f"\nReport Category: {category}")
    
    # Test masked language modeling with the fine-tuned model
    test_masked_text = "The patient's hemoglobin level was [MASK] g/dL, which is within normal range."
    print(f"\nTesting masked language modeling with: {test_masked_text}")
    
    # Create a fill-mask pipeline with the fine-tuned model
    fill_mask = pipeline("fill-mask", model=model_path, tokenizer=model_path)
    predictions = fill_mask(test_masked_text)
    
    # Display the predictions
    print("\nTop predictions for the masked token:")
    for pred in predictions[:5]:  # Show top 5 predictions
        print(f"- {pred['token_str']}: {pred['score']:.4f}")
    
    print("\n✅ Fine-tuned model integration complete!")
    return processor


def main():
    parser = argparse.ArgumentParser(description="Integrate fine-tuned BioBERT model with BioBertProcessor")
    args = parser.parse_args()
    
    # Integrate the fine-tuned model
    processor = integrate_fine_tuned_model()


if __name__ == "__main__":
    main()