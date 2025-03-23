## About This Project
This project is a **information retrieval system** that allows users to upload and search documents (PDF & TXT files). It uses **TF-IDF vectorization** for efficient information retrieval. The backend is built with **Flask**, while the frontend is built with **Next.js**.

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- [**Node.js**](https://nodejs.org/)
- [**Python**](https://www.python.org/)

### Clone the Repository
```bash
git clone https://github.com/MrAHMED14/retrieve.git
cd retrieve
```

### Set Up the Backend 
Navigate to the `backend/` folder and install the dependencies:

```bash
cd backend
pip install -r requirements.txt
python nltk-download.py
python app.py
```

By default, the server will run at: `http://127.0.0.1:5000`

---

### Set Up the Frontend
Navigate to the `frontend/` folder and install the dependencies:
```bash
cd frontend
npm i && npm run build
npm start
```
By default, the server will run at: `http://127.0.0.1:3000`

## API Endpoints
### Upload Files
- **Endpoint:** `POST /upload`
- **Description:** Uploads PDF and TXT files.
- **Usage:**
```bash
curl -X POST -F "file=@document.pdf" http://127.0.0.1:5000/upload
```

### Search Documents
- **Endpoint:** `GET /search?q=<query>`
- **Description:** Searches for a keyword in the uploaded files.
- **Usage:**
```bash
curl -X GET "http://127.0.0.1:5000/search?q=information"
```

## Contributing
Feel free to submit **issues or pull requests** to improve this project!