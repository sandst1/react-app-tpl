import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ArticleList.css";

interface Article {
  id: number;
  title: string;
  author: string;
  content: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    author: "",
    content: "",
  });
  const [filterText, setFilterText] = useState("");
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(filterText.toLowerCase()) ||
        article.author.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [articles, filterText]);

  const fetchArticles = () => {
    fetch("http://localhost:3001/articles")
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => console.error("Error fetching articles:", error));
  };

  const handleCreateArticle = () => {
    fetch("http://localhost:3001/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    })
      .then((response) => response.json())
      .then(() => {
        fetchArticles();
        setIsCreating(false);
        setNewArticle({ title: "", author: "", content: "" });
      })
      .catch((error) => console.error("Error creating article:", error));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleDeleteArticle = (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    fetch(`http://localhost:3001/articles/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchArticles();
        } else {
          console.error("Error deleting article");
        }
      })
      .catch((error) => console.error("Error deleting article:", error));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleSelectArticle = (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedArticles((prev) =>
      prev.includes(id)
        ? prev.filter((articleId) => articleId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    Promise.all(
      selectedArticles.map((id) =>
        fetch(`http://localhost:3001/articles/${id}`, {
          method: "DELETE",
        })
      )
    )
      .then(() => {
        fetchArticles();
        setSelectedArticles([]);
      })
      .catch((error) => console.error("Error deleting articles:", error));
  };

  const handleCopyArticle = (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    fetch(`http://localhost:3001/articles/${id}`)
      .then((response) => response.json())
      .then((article) => {
        const copiedArticle = {
          ...article,
          title: `Copy of ${article.title}`,
          id: undefined, // Remove the id so the server will assign a new one
        };
        return fetch("http://localhost:3001/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(copiedArticle),
        });
      })
      .then((response) => response.json())
      .then(() => {
        fetchArticles();
      })
      .catch((error) => console.error("Error copying article:", error));
  };

  return (
    <div className="article-list">
      <h2>Articles</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter articles..."
          value={filterText}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>
      <button
        className="toggle-create-button"
        onClick={() => setIsCreating(!isCreating)}
      >
        {isCreating ? "Cancel" : "Create Article"}
      </button>
      {isCreating && (
        <div className="create-article-form">
          <input
            type="text"
            name="title"
            value={newArticle.title}
            onChange={handleInputChange}
            placeholder="Title"
          />
          <input
            type="text"
            name="author"
            value={newArticle.author}
            onChange={handleInputChange}
            placeholder="Author"
          />
          <textarea
            name="content"
            value={newArticle.content}
            onChange={handleInputChange}
            placeholder="Content"
          />
          <button onClick={handleCreateArticle}>Submit</button>
        </div>
      )}
      {selectedArticles.length > 0 && (
        <button
          className="delete-selected-button"
          onClick={handleDeleteSelected}
        >
          Delete Selected ({selectedArticles.length})
        </button>
      )}
      <div className="article-grid">
        {filteredArticles.map((article) => (
          <div key={article.id} className="article-card">
            <input
              type="checkbox"
              checked={selectedArticles.includes(article.id)}
              onChange={(e) => handleSelectArticle(article.id, e)}
              className="article-checkbox"
            />
            <Link to={`/article/${article.id}`}>
              <h3>{article.title}</h3>
              <p>By: {article.author}</p>
            </Link>
            <button
              className="delete-button"
              onClick={(e) => handleDeleteArticle(article.id, e)}
            >
              Delete
            </button>
            <button
              className="copy-button"
              onClick={(e) => handleCopyArticle(article.id, e)}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
