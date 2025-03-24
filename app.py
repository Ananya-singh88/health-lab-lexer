from flask import Flask, render_template, request, jsonify, url_for
from process_medical_text import create_tokenized_dataset, preprocess_text
import json

app = Flask(__name__, static_folder='static')

@app.route('/', methods=['GET', 'POST'])
def index():
    try:
        if request.method == 'POST':
            text = request.form.get('medical_text', '')
            if text:
                # Process the text
                tokenized_data = create_tokenized_dataset(text)
                processed_sentences = preprocess_text(text)
                
                # Get the first example's tokens
                first_example = tokenized_data[0]
                
                return render_template('index.html', 
                                    processed_sentences=processed_sentences,
                                    tokenized_data=first_example,
                                    input_text=text)
        
        return render_template('index.html')
    except Exception as e:
        return render_template('index.html', error=str(e))

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=3000)