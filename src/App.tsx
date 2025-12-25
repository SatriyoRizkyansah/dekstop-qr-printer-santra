import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import QueueService from "./components/QueueService";
import "./App.css";

type PageType = "login" | "dashboard" | "queue";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState<PageType>("login");

  useEffect(() => {
    // Logic to fetch available printers and set the default printer
  }, []);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCurrentPage("login");
  };

  const goToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const goToQueueService = () => {
    setCurrentPage("queue");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const pageComponent = currentPage === "dashboard" ? <Dashboard username={username} /> : <QueueService />;

  return (
    <div className="app-container">
      <div className="app-with-header">
        <header className="app-header">
          <div className="header-left">
            <h1>🖨️ QR Printer App</h1>
          </div>
          <nav className="app-nav">
            <button className={`nav-btn ${currentPage === "dashboard" ? "active" : ""}`} onClick={goToDashboard}>
              📊 Dashboard
            </button>
            <button className={`nav-btn ${currentPage === "queue" ? "active" : ""}`} onClick={goToQueueService}>
              🎫 Queue Service
            </button>
          </nav>
          <div className="header-right">
            <span className="user-name">{username}</span>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </header>
        {pageComponent}
      </div>
    </div>
  );
};

export default App;
