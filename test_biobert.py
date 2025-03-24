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

if __name__ == "__main__":
    main()