import os
import fitz 
import nltk
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Point NLTK to the local directory
NLTK_LOCAL_PATH = os.path.abspath("./backend/nltk_data")
nltk.data.path.append(NLTK_LOCAL_PATH)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

documents = {}  # Store extracted text
vectorizer = TfidfVectorizer()
tfidf_matrix = None
document_names = []

# Function to generate a unique ID for a file
def generate_file_id(filename):
    return hashlib.md5(filename.encode()).hexdigest()

# Function to extract text from PDFs
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text() for page in doc])
    return text

# Function to extract text from TXT files
def extract_text_from_txt(txt_path):
    with open(txt_path, "r", encoding="utf-8") as file:
        return file.read()

# Function to preprocess text
def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word.isalnum()]
    tokens = [word for word in tokens if word not in stopwords.words("english")]
    return " ".join(tokens)

# Function to index documents
def build_index():
    global tfidf_matrix, document_names
    corpus = list(documents.values())
    if corpus:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        document_names = list(documents.keys())

# Upload PDFs and extract text
@app.route("/upload", methods=["POST"])
def upload_files():
    if "file" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("file")
    if not files:
        return jsonify({"error": "No files selected"}), 400

    for file in files:
        if file.filename == "":
            continue  # Skip empty file names
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        file_ext = filename.split(".")[-1].lower()

        if file_ext == "pdf":
            text = extract_text_from_pdf(filepath)
        elif file_ext == "txt":
            text = extract_text_from_txt(filepath)
        else:
            return jsonify({"error": "Unsupported file format"}), 400 
        
        processed_text = preprocess_text(text)
        documents[filename] = processed_text  # Store processed text

    build_index()  # Update TF-IDF index 

    return jsonify({"message": "Files uploaded successfully", "files": list(documents.keys())})

# Function to get a snippet around the search term
def get_snippet(document_text, query, snippet_length=50):
    words = document_text.split()
    query_words = query.lower().split()
    
    for i, word in enumerate(words):
        if any(qw in word.lower() for qw in query_words):
            start = max(i - snippet_length // 2, 0)
            end = min(i + snippet_length // 2, len(words))
            return " ".join(words[start:end]) + "..."
    
    return document_text[:snippet_length] + "..."  # Default snippet

# Search for relevant documents
@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "").strip()
    print(f"Received query: {query}")  # Debugging line
    
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    if not documents:
        return jsonify({"error": "No documents indexed"}), 400

    query_vector = vectorizer.transform([preprocess_text(query)])
    similarities = np.dot(tfidf_matrix, query_vector.T).toarray().flatten()
    
    ranked_indices = np.argsort(similarities)[::-1]
    ranked_docs = [
        {
            "id": int(i),
            "filename": document_names[i],
            "fileType": document_names[i].split(".")[-1],
            "score": float(similarities[i]),
            "snippet": get_snippet(documents[document_names[i]], query)
        }
        for i in ranked_indices if similarities[i] > 0
    ]

    return jsonify({"results": ranked_docs})  # Return top 5 results

@app.route("/reset", methods=["GET"])
def reset_index():
    global documents, tfidf_matrix, document_names

    # Clear indexed documents
    documents = {}
    tfidf_matrix = None
    document_names = []

    # Remove all files in the upload folder
    for filename in os.listdir(app.config["UPLOAD_FOLDER"]):
        if filename == ".gitignore":
            continue   

        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        try:
            os.remove(file_path)
        except Exception as e:
            return jsonify({"error": f"Failed to delete {filename}: {str(e)}"}), 500

    return jsonify({"message": "Index reset and files removed successfully"})

# List all available files with attributes
@app.route("/files", methods=["GET"])
def list_files():
    files_info = []
    for filename in os.listdir(app.config["UPLOAD_FOLDER"]):
        if filename == ".gitignore":
            continue

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        if os.path.isfile(filepath):
            file_info = {
                "id": generate_file_id(filename),
                "name": filename,
                "fileType": filename.split(".")[-1].lower(),
                "size": os.path.getsize(filepath),  # File size in bytes
            }
            files_info.append(file_info)

    return jsonify({"files": files_info})

# Get details of a single file
@app.route("/file/<id>", methods=["GET"])
def get_file(id):
    for filename in os.listdir(app.config["UPLOAD_FOLDER"]):
        if filename == ".gitignore":
            continue

        if generate_file_id(filename) == id:
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            return jsonify({
                "id": id,
                "name": filename,
                "filetype": filename.split(".")[-1].lower(),
                "size": os.path.getsize(filepath)
            })
    
    return jsonify({"error": "File not found"}), 404

# Delete a file
@app.route("/file/<id>/delete", methods=["DELETE"])
def delete_file(id):
    for filename in os.listdir(app.config["UPLOAD_FOLDER"]):
        if filename == ".gitignore":
            continue
        
        if generate_file_id(filename) == id:
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            os.remove(filepath)

            # Remove file from index
            if filename in documents:
                del documents[filename]

            # Rebuild the TF-IDF index
            build_index()

            return jsonify({"message": "File deleted successfully", "id": id})
    
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    for filename in os.listdir("uploads"):
        filepath = os.path.join("uploads", filename)

        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(filepath)
        elif filename.endswith(".txt"):
            text = extract_text_from_txt(filepath)
        else:
            continue  # Skip unsupported file types

        processed_text = preprocess_text(text)
        documents[filename] = processed_text  


    build_index()
    app.run(host="0.0.0.0", port=5000)
