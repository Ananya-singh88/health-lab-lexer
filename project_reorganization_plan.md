# AI Health Parser Project Reorganization Plan

## Current Issues

1. Mixed backend (Python) and frontend (React/TypeScript) code in the root directory
2. Incomplete or partially implemented features (biobert_routes.py)
3. Duplicate files (server.py and server.py.new)
4. No clear separation between API services, data processing, and model components

## Proposed Structure

```
AI Health Parser/
├── backend/                  # All Python backend code
│   ├── api/                  # API endpoints and routes
│   │   ├── __init__.py
│   │   ├── routes.py         # Main API routes
│   │   └── biobert_routes.py # BioBERT specific routes
│   ├── models/               # ML models and processors
│   │   ├── __init__.py
│   │   ├── biobert_processor.py
│   │   └── process_medical_text.py
│   ├── utils/                # Utility functions
│   │   ├── __init__.py
│   │   └── pdf_extractor.py  # PDF processing utilities
│   ├── app.py               # Flask app entry point
│   ├── server.py            # FastAPI server entry point
│   └── requirements.txt     # Python dependencies
├── frontend/                # All React/TypeScript frontend code
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # UI components
│   │   │   ├── charts/      # Chart components
│   │   │   ├── health/      # Health-related components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # UI primitives
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── .gitignore
└── README.md                # Project documentation
```

## Implementation Steps

1. Create the new directory structure
2. Move backend Python files to appropriate locations
3. Move frontend files to the frontend directory
4. Update import paths in all files
5. Update API endpoint URLs in frontend services
6. Test the application to ensure everything works

## Benefits

- Clear separation of concerns between backend and frontend
- Better organization of related components
- Easier maintenance and future development
- Improved developer experience with logical file grouping
- Clearer project structure for new team members