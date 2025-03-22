import nltk

NLTK_LOCAL_PATH = "./backend/nltk_data"

nltk.download("punkt", download_dir=NLTK_LOCAL_PATH)
nltk.download("stopwords", download_dir=NLTK_LOCAL_PATH)
# nltk.download("all", download_dir=NLTK_LOCAL_PATH)

print("NLTK resources downloaded locally!")
