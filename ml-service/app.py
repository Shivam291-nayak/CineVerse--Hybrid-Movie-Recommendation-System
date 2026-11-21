
from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load trained ML model
tfidf = joblib.load("tfidf.pkl")
tfidf_matrix = joblib.load("tfidf_matrix.pkl")
movies = joblib.load("movies.pkl")

# Create title index
movies["title"] = movies["title"].fillna("").astype(str)
indices = pd.Series(
    movies.index,
    index=movies["title"].str.lower()
).drop_duplicates()

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ML service running"})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(silent=True) or {}
    title = str(data.get("title", "")).strip().lower()
    limit = min(max(int(data.get("limit", 10)), 1), 50)

    if not title:
        return jsonify({"error": "Movie title is required"}), 400

    if title not in indices:
        return jsonify({"error": "Movie not found"}), 404

    movie_index = indices[title]
    similarity_scores = cosine_similarity(
        tfidf_matrix[movie_index],
        tfidf_matrix
    ).flatten()

    similar_indices = similarity_scores.argsort()[::-1][1:limit + 1]

    recommendations = []

    for index in similar_indices:
        row = movies.iloc[index]
        recommendations.append({
            "title": str(row["title"]),
            "genre": str(row.get("listed_in", "")),
            "releaseYear": str(row.get("release_year", "")),
            "similarity": round(float(similarity_scores[index]), 4)
        })

    return jsonify({
        "message": "Content-based recommendations generated",
        "source": "Trained TF-IDF model",
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
