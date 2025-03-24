from biobert_processor import BioBertProcessor
import time

def main():
    print("Initializing BioBertProcessor...")
    start_time = time.time()
    processor = BioBertProcessor()
    print(f"Initialization completed in {time.time() - start_time:.2f} seconds")
    
    # Test text with medical information
    test_text = """
    Patient's lab results show glucose: 120 mg/dL, cholesterol: 190 mg/dL, 
    HDL: 45 mg/dL, LDL: 110 mg/dL. Blood pressure was measured at 130/85 mmHg.
    A1C is 6.2%. Creatinine level is 0.9 mg/dL with eGFR of 85 mL/min/1.73m2.
    """
    
    print("\nExtracting metrics with regex...")
    regex_metrics = processor.extract_metrics_with_regex(test_text)
    print(f"Found {len(regex_metrics)} metrics using regex:")
    for metric in regex_metrics:
        print(f"  - {metric['name']}: {metric['value']} {metric['unit']}")
    
    print("\nExtracting metrics with BERT...")
    bert_metrics = processor.extract_metrics_with_bert(test_text)
    print(f"Found {len(bert_metrics)} metrics using BERT:")
    for metric in bert_metrics:
        print(f"  - {metric['name']}: {metric['value']} {metric['unit']} (source: {metric['source']})")
    
    print("\nDetermining report category...")
    category = processor.determine_report_category(test_text, bert_metrics)
    print(f"Report category: {category}")
    
    # Example of preparing training data for fine-tuning
    print("\nPreparing example training data...")
    texts = [
        "Patient has glucose level of 120 mg/dL",
        "Blood pressure is 130/85 mmHg",
        "A1C measured at 6.2% indicates good glycemic control"
    ]
    
    annotations = [
        {"entities": [{"start": 12, "end": 25, "label": "TEST"}]},
        {"entities": [{"start": 0, "end": 14, "label": "TEST"}]},
        {"entities": [{"start": 0, "end": 3, "label": "TEST"}, {"start": 27, "end": 43, "label": "PROBLEM"}]}
    ]
    
    # Prepare the training data
    training_data = processor.prepare_training_data(texts, annotations)
    print(f"Prepared {len(training_data)} training examples")
    
    # Uncomment the following lines to actually run the fine-tuning
    # (Note: This will take significant time and computational resources)
    """
    print("\nStarting model fine-tuning...")
    fine_tune_results = processor.fine_tune_model(
        training_data, 
        epochs=1,  # Using just 1 epoch for demonstration
        batch_size=2,
        learning_rate=3e-5
    )
    print("Fine-tuning complete!")
    
    # Test the fine-tuned model
    print("\nTesting fine-tuned model...")
    bert_metrics_after = processor.extract_metrics_with_bert(test_text)
    print(f"Found {len(bert_metrics_after)} metrics using fine-tuned BERT:")
    for metric in bert_metrics_after:
        print(f"  - {metric['name']}: {metric['value']} {metric['unit']} (source: {metric['source']})")
    """

if __name__ == "__main__":
    main()