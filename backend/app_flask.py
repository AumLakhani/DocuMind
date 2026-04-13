import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pdf_loader import load_pdf
from chunking import chunk_text
from embeddings import get_embeddings
from vector_store import create_faiss_index, search
from qa_pipeline import generate_answer

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
UPLOAD_DIR   = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

all_chunks     = []
all_embeddings = []
index          = None


@app.route('/')
def home():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


@app.route('/upload', methods=['POST'])
def upload_pdf():
    global all_chunks, all_embeddings, index

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        file.save(file_path)

        text       = load_pdf(file_path)
        chunks     = chunk_text(text)
        embeddings = get_embeddings(chunks)

        all_chunks     = chunks
        all_embeddings = embeddings
        index          = create_faiss_index(all_embeddings)

        return jsonify({
            'message':      f'{file.filename} uploaded successfully',
            'total_chunks': len(all_chunks)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/ask', methods=['POST'])
def ask():
    global all_chunks, index

    data  = request.json
    query = data.get('query') if data else None

    if not query:
        return jsonify({'error': 'No query provided'}), 400
    if index is None:
        return jsonify({'error': 'Please upload a PDF first'}), 400

    try:
        query_embedding = get_embeddings([query])[0]
        results         = search(index, query_embedding, all_chunks)
        answer          = generate_answer(query, results)
        return jsonify({'answer': answer})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # ✅ Port 7860 — forHugging Face Spaces
    port = int(os.environ.get('PORT', 7860))
    print(f'Starting DocuMind on port {port}...')
    app.run(host='0.0.0.0', port=port, debug=False)
