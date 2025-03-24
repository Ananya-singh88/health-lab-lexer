from transformers import AutoTokenizer, AutoModel, pipeline, Trainer, TrainingArguments
import torch
import re
from typing import Dict, Any, List, Tuple
import os
import numpy as np
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split

class BioBertProcessor:
    """A processor class that uses Bio_ClinicalBERT to analyze medical text"""
    
    def __init__(self):
        """Initialize the BioBertProcessor with the Bio_ClinicalBERT model"""
        # Load the model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        self.model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        
        # Initialize NER pipeline for medical entity recognition
        self.ner_pipeline = pipeline(
            "ner",
            model="emilyalsentzer/Bio_ClinicalBERT",
            tokenizer=self.tokenizer,
            aggregation_strategy="simple"
        )
        
        # Common medical test patterns (reusing from server.py.new)
        self.medical_patterns = {
            "glucose": r"(?:glucose|blood\s+sugar)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mg/dL|mmol/L)?",
            "cholesterol": r"(?:total\s+cholesterol|cholesterol)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mg/dL|mmol/L)?",
            "hdl": r"(?:hdl|hdl-c|high\s+density\s+lipoprotein)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mg/dL|mmol/L)?",
            "ldl": r"(?:ldl|ldl-c|low\s+density\s+lipoprotein)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mg/dL|mmol/L)?",
            "triglycerides": r"(?:triglycerides|tg)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mg/dL|mmol/L)?",
            "a1c": r"(?:a1c|hba1c|glycated\s+hemoglobin)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(%|mmol/mol)?",
            "blood_pressure": r"(?:blood\s+pressure|bp)\s*[:-]?\s*(\d+)\s*[/]\s*(\d+)\s*(mmHg)?",
            "heart_rate": r"(?:heart\s+rate|pulse)\s*[:-]?\s*(\d+)\s*(bpm)?",
            "creatinine": r"(?:creatinine|cr)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mg/dL|μmol/L)?",
            "egfr": r"(?:egfr|estimated\s+glomerular\s+filtration\s+rate)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mL/min/1.73m2)?",
            "tsh": r"(?:tsh|thyroid\s+stimulating\s+hormone)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(mIU/L|μIU/mL)?",
            "wbc": r"(?:wbc|white\s+blood\s+cells|leukocytes)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(×10\^9/L|×10\^3/μL)?",
            "rbc": r"(?:rbc|red\s+blood\s+cells|erythrocytes)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(×10\^12/L|×10\^6/μL)?",
            "hemoglobin": r"(?:hemoglobin|hgb|hb)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(g/dL|g/L)?",
            "alt": r"(?:alt|alanine\s+aminotransferase|sgpt)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(U/L|IU/L)?",
            "ast": r"(?:ast|aspartate\s+aminotransferase|sgot)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*(U/L|IU/L)?"
        }
        
        # Medical categories mapping
        self.category_keywords = {
            "diabetes": ["glucose", "a1c", "insulin", "diabetes", "glycemic"],
            "lipid": ["cholesterol", "hdl", "ldl", "triglycerides", "lipid"],
            "cbc": ["hemoglobin", "hematocrit", "wbc", "rbc", "platelets", "blood count"],
            "liver": ["alt", "ast", "alp", "bilirubin", "liver", "hepatic"],
            "kidney": ["creatinine", "egfr", "bun", "kidney", "renal"]
        }
        
        # Path for saving fine-tuned model
        self.model_save_path = "/Users/purushothamrj/AI Health Parser/fine_tuned_biobert"
    
    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """Extract medical entities from text using the NER pipeline
        
        Args:
            text: The medical text to analyze
            
        Returns:
            List of extracted entities with their labels and scores
        """
        try:
            # Process the text with the NER pipeline
            entities = self.ner_pipeline(text)
            return entities
        except Exception as e:
            print(f"Error extracting entities: {str(e)}")
            return []
    
    def extract_metrics_with_bert(self, text: str) -> List[Dict[str, Any]]:
        """Extract medical metrics using Bio_ClinicalBERT and regex patterns
        
        Args:
            text: The medical text to analyze
            
        Returns:
            List of extracted metrics with their values and units
        """
        metrics = []
        
        # First use regex patterns for structured data extraction
        regex_metrics = self.extract_metrics_with_regex(text)
        metrics.extend(regex_metrics)
        
        # Then use BERT to find additional entities not captured by regex
        entities = self.extract_entities(text)
        
        # Process entities to extract potential metrics
        for entity in entities:
            # Skip entities with low confidence
            if entity.get('score', 0) < 0.7:
                continue
                
            entity_text = entity.get('word', '')
            entity_type = entity.get('entity', '')
            
            # Look for numeric values near the entity
            if self._is_medical_test_entity(entity_type, entity_text):
                # Find numeric values in the context around this entity
                value_unit = self._find_value_near_entity(text, entity_text)
                if value_unit:
                    value, unit = value_unit
                    
                    # Check if this metric is already extracted by regex
                    if not self._is_duplicate_metric(metrics, entity_text, value):
                        metrics.append({
                            "name": self._format_metric_name(entity_text),
                            "value": value,
                            "unit": unit,
                            "status": "normal",  # Default status
                            "source": "bert"
                        })
        
        return metrics
    
    def extract_metrics_with_regex(self, text: str) -> List[Dict[str, Any]]:
        """Extract medical metrics using regex patterns
        
        Args:
            text: The medical text to analyze
            
        Returns:
            List of extracted metrics with their values and units
        """
        metrics = []
        
        # Convert text to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Extract metrics using regex patterns
        for metric_name, pattern in self.medical_patterns.items():
            matches = re.findall(pattern, text_lower)
            
            if matches:
                # Handle special case for blood pressure which has two values
                if metric_name == "blood_pressure" and len(matches[0]) >= 2:
                    systolic, diastolic = matches[0][0], matches[0][1]
                    unit = matches[0][2] if len(matches[0]) > 2 and matches[0][2] else "mmHg"
                    
                    # Add systolic blood pressure
                    metrics.append({
                        "name": "Blood Pressure (Systolic)",
                        "value": float(systolic),
                        "unit": unit,
                        "status": "normal",  # Will be updated later
                        "source": "regex"
                    })
                    
                    # Add diastolic blood pressure
                    metrics.append({
                        "name": "Blood Pressure (Diastolic)",
                        "value": float(diastolic),
                        "unit": unit,
                        "status": "normal",  # Will be updated later
                        "source": "regex"
                    })
                else:
                    # Handle regular metrics with single values
                    value = float(matches[0][0])
                    unit = matches[0][1] if len(matches[0]) > 1 and matches[0][1] else ""
                    
                    # Format the metric name for display
                    display_name = " ".join(word.capitalize() for word in metric_name.replace("_", " ").split())
                    
                    metrics.append({
                        "name": display_name,
                        "value": value,
                        "unit": unit,
                        "status": "normal",  # Will be updated later
                        "source": "regex"
                    })
        
        return metrics
    
    def determine_report_category(self, text: str, metrics: List[Dict[str, Any]]) -> str:
        """Determine the category of the medical report based on extracted metrics and text
        
        Args:
            text: The medical text
            metrics: The extracted metrics
            
        Returns:
            The determined category (diabetes, lipid, cbc, liver, kidney, or general)
        """
        # Convert text to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Count occurrences of category keywords in the text
        category_scores = {category: 0 for category in self.category_keywords}
        
        # Score based on text content
        for category, keywords in self.category_keywords.items():
            for keyword in keywords:
                count = text_lower.count(keyword)
                category_scores[category] += count
        
        # Score based on extracted metrics
        for metric in metrics:
            metric_name = metric["name"].lower()
            for category, keywords in self.category_keywords.items():
                if any(keyword in metric_name for keyword in keywords):
                    category_scores[category] += 2  # Give more weight to actual metrics
        
        # Find the category with the highest score
        max_score = 0
        best_category = "general"
        
        for category, score in category_scores.items():
            if score > max_score:
                max_score = score
                best_category = category
        
        # If no clear category is found, return general
        return best_category if max_score > 0 else "general"
    
    def _is_medical_test_entity(self, entity_type: str, entity_text: str) -> bool:
        """Check if an entity is likely to be a medical test
        
        Args:
            entity_type: The entity type from NER
            entity_text: The entity text
            
        Returns:
            True if the entity is likely a medical test, False otherwise
        """
        # Check if the entity type is related to medical tests
        medical_entity_types = ["TEST", "PROBLEM", "TREATMENT"]
        
        # Check if the entity text contains common medical test keywords
        medical_test_keywords = ["level", "count", "test", "rate", "index", "ratio"]
        
        return (entity_type in medical_entity_types or 
                any(keyword in entity_text.lower() for keyword in medical_test_keywords))
    
    def _find_value_near_entity(self, text: str, entity_text: str) -> Tuple[float, str]:
        """Find a numeric value near an entity in the text
        
        Args:
            text: The full text
            entity_text: The entity to look for values near
            
        Returns:
            Tuple of (value, unit) if found, None otherwise
        """
        # Look for the entity in the text
        entity_pos = text.lower().find(entity_text.lower())
        if entity_pos == -1:
            return None
        
        # Get a window of text around the entity
        window_start = max(0, entity_pos - 50)
        window_end = min(len(text), entity_pos + len(entity_text) + 50)
        window_text = text[window_start:window_end]
        
        # Look for numeric values in the window
        value_pattern = r"(\d+(?:\.\d+)?)\s*([a-zA-Z/%]+)?"
        matches = re.findall(value_pattern, window_text)
        
        if matches:
            # Get the closest match to the entity
            for match in matches:
                value, unit = match
                try:
                    return float(value), unit.strip()
                except ValueError:
                    continue
        
        return None
    
    def _is_duplicate_metric(self, metrics: List[Dict[str, Any]], name: str, value: float) -> bool:
        """Check if a metric with similar name and value already exists
        
        Args:
            metrics: List of existing metrics
            name: Name of the metric to check
            value: Value of the metric to check
            
        Returns:
            True if a similar metric exists, False otherwise
        """
        name_lower = name.lower()
        
        for metric in metrics:
            metric_name = metric["name"].lower()
            metric_value = metric["value"]
            
            # Check if names are similar
            if (name_lower in metric_name or metric_name in name_lower):
                # Check if values are close (within 5% of each other)
                if abs(metric_value - value) / max(metric_value, value) < 0.05:
                    return True
        
        return False
        
    def _format_metric_name(self, name: str) -> str:
        """Format a metric name for display
        
        Args:
            name: The raw metric name
            
        Returns:
            Formatted metric name
        """
        # Remove common prefixes/suffixes
        clean_name = re.sub(r'(level|count|test|rate)$', '', name)
        
        # Split by common delimiters and capitalize each word
        words = re.split(r'[\s_-]+', clean_name)
        formatted_name = ' '.join(word.capitalize() for word in words if word)
        
        return formatted_name.strip()
    
    def fine_tune_model(self, training_data: List[Dict[str, Any]], epochs: int = 3, batch_size: int = 8, learning_rate: float = 5e-5):
        """Fine-tune the BioBERT model on custom medical data
        
        Args:
            training_data: List of dictionaries with 'text' and 'labels' keys
            epochs: Number of training epochs
            batch_size: Training batch size
            learning_rate: Learning rate for training
            
        Returns:
            Training metrics
        """
        print("Preparing dataset for fine-tuning...")
        
        # Create a custom dataset class
        class MedicalDataset(Dataset):
            def __init__(self, texts, labels, tokenizer, max_length=128):
                self.encodings = tokenizer(texts, truncation=True, padding=True, max_length=max_length, return_tensors="pt")
                self.labels = labels
            
            def __getitem__(self, idx):
                item = {key: val[idx] for key, val in self.encodings.items()}
                item['labels'] = torch.tensor(self.labels[idx])
                return item
            
            def __len__(self):
                return len(self.labels)
        
        # Extract texts and labels from training data
        texts = [item['text'] for item in training_data]
        labels = [item['labels'] for item in training_data]
        
        # Split data into training and validation sets
        train_texts, val_texts, train_labels, val_labels = train_test_split(
            texts, labels, test_size=0.2, random_state=42
        )
        
        # Create datasets
        train_dataset = MedicalDataset(train_texts, train_labels, self.tokenizer)
        val_dataset = MedicalDataset(val_texts, val_labels, self.tokenizer)
        
        # Define training arguments
        training_args = TrainingArguments(
            output_dir=self.model_save_path,
            num_train_epochs=epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir=os.path.join(self.model_save_path, 'logs'),
            logging_steps=10,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            learning_rate=learning_rate,
        )
        
        # Define compute metrics function
        def compute_metrics(eval_pred):
            logits, labels = eval_pred
            predictions = np.argmax(logits, axis=-1)
            accuracy = np.mean(predictions == labels)
            return {"accuracy": accuracy}
        
        # Initialize Trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            compute_metrics=compute_metrics,
        )
        
        print("Starting fine-tuning process...")
        # Train the model
        train_results = trainer.train()
        
        # Save the fine-tuned model
        self.model.save_pretrained(self.model_save_path)
        self.tokenizer.save_pretrained(self.model_save_path)
        
        print(f"Model fine-tuning complete. Model saved to {self.model_save_path}")
        
        # Update the model and tokenizer to use the fine-tuned version
        self._update_model_and_pipelines()
        
        return train_results
    
    def _update_model_and_pipelines(self):
        """Update the model and pipelines to use the fine-tuned version"""
        if os.path.exists(self.model_save_path):
            print(f"Loading fine-tuned model from {self.model_save_path}")
            # Load the fine-tuned model and tokenizer
            self.model = AutoModel.from_pretrained(self.model_save_path)
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_save_path)
            
            # Reinitialize the NER pipeline with the fine-tuned model
            self.ner_pipeline = pipeline(
                "ner",
                model=self.model_save_path,
                tokenizer=self.tokenizer,
                aggregation_strategy="simple"
            )
            print("Model and pipelines updated successfully")
        else:
            print("Fine-tuned model not found. Using the default model.")
    
    def load_fine_tuned_model(self, model_path: str = None):
        """Load a previously fine-tuned model
        
        Args:
            model_path: Path to the fine-tuned model directory
        """
        path_to_use = model_path if model_path else self.model_save_path
        
        if os.path.exists(path_to_use):
            print(f"Loading fine-tuned model from {path_to_use}")
            # Load the fine-tuned model and tokenizer
            self.model = AutoModel.from_pretrained(path_to_use)
            self.tokenizer = AutoTokenizer.from_pretrained(path_to_use)
            
            # Reinitialize the NER pipeline with the fine-tuned model
            self.ner_pipeline = pipeline(
                "ner",
                model=path_to_use,
                tokenizer=self.tokenizer,
                aggregation_strategy="simple"
            )
            print("Fine-tuned model loaded successfully")
            return True
        else:
            print(f"Fine-tuned model not found at {path_to_use}. Using the default model.")
            return False
    
    def prepare_training_data(self, texts: List[str], annotations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Prepare training data from texts and annotations
        
        Args:
            texts: List of medical texts
            annotations: List of annotation dictionaries with entity spans and labels
            
        Returns:
            List of training data items with text and labels
        """
        training_data = []
        
        for i, text in enumerate(texts):
            if i < len(annotations):
                annotation = annotations[i]
                # Convert annotations to the format expected by the model
                labels = self._convert_annotations_to_labels(text, annotation)
                
                training_data.append({
                    "text": text,
                    "labels": labels
                })
        
        return training_data
    
    def _convert_annotations_to_labels(self, text: str, annotation: Dict[str, Any]) -> List[int]:
        """Convert annotations to label indices for training
        
        Args:
            text: The text being annotated
            annotation: Dictionary with entity spans and labels
            
        Returns:
            List of label indices for each token
        """
        # This is a simplified implementation - you'll need to adapt this
        # to your specific annotation format and label scheme
        
        # Tokenize the text
        tokens = self.tokenizer.tokenize(text)
        
        # Initialize labels (0 for 'O' - outside any entity)
        labels = [0] * len(tokens)
        
        # Process each annotation
        for entity in annotation.get("entities", []):
            start = entity.get("start")
            end = entity.get("end")
            label = entity.get("label")
            
            # Find token indices that correspond to this span
            # This is a simplified approach and may need refinement
            span_text = text[start:end]
            span_tokens = self.tokenizer.tokenize(span_text)
            
            # Find where these tokens appear in the full tokenized text
            for i in range(len(tokens) - len(span_tokens) + 1):
                if tokens[i:i+len(span_tokens)] == span_tokens:
                    # Assign labels to these tokens
                    label_idx = self._get_label_index(label)
                    for j in range(i, i+len(span_tokens)):
                        labels[j] = label_idx
        
        return labels
    
    def _get_label_index(self, label: str) -> int:
        """Convert a label string to its index
        
        Args:
            label: The label string
            
        Returns:
            The label index
        """
        # This is a placeholder - you'll need to define your own label mapping
        label_map = {
            "O": 0,
            "TEST": 1,
            "PROBLEM": 2,
            "TREATMENT": 3,
            # Add more labels as needed
        }
        
        return label_map.get(label.upper(), 0)  # Default to 'O' if label not found