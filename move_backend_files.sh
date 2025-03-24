#!/bin/bash

# Create any missing backend directories
mkdir -p backend/api
mkdir -p backend/models
mkdir -p backend/utils

# Move Python files to appropriate locations
# Main server files
cp server.py backend/
cp app.py backend/

# Model files
cp process_medical_text.py backend/models/
cp biobert_processor.py backend/models/
cp run_biobert.py backend/models/
cp test_biobert.py backend/models/
cp test_biobert_finetuning.py backend/models/

# API routes
cp biobert_routes.py backend/api/

# Utility files
cp download_nltk_data.py backend/utils/

# Copy requirements
cp requirements.txt backend/

echo "Backend files moved to backend/ directory"