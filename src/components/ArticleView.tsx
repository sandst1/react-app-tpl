import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ArticleView.css";

interface Article {
  id: number;
  title: string;
  author: string;
  content: string;
}

const ArticleView: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = () => {
    fetch(`http://localhost:3001/articles/${id}`)
      .then((response) => response.json())
      .then((data) => setArticle(data))
      .catch((error) => console.error("Error fetching article:", error));
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="article-view">
      <h2>{article.title}</h2>
      <p className="author">By: {article.author}</p>
      <div className="article-content">{article.content}</div>
      <div className="button-container">
        <Link to="/" className="back-button">
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default ArticleView;
