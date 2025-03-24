from fastapi import APIRouter, HTTPException, Body, UploadFile, File
import io
import json
from typing import Dict, Any
from biobert_processor import BioBertProcessor

# Initialize router
router = APIRouter()

# Initialize the BioBertProcessor
biobert_