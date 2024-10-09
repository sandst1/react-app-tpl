import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ArticleList from "./components/ArticleList";
import ArticleView from "./components/ArticleView";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <h1>Article Manager</h1>
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/article/:id" element={<ArticleView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
