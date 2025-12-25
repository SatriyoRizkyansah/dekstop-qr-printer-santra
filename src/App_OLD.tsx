import React, { useState } from "react";
import Login from "./components/Login";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");

  const handleLogin = (user: string, printer: string) => {
    setUsername(user);
    setSelectedPrinter(printer);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setSelectedPrinter("");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="logged-in-view">
        <header className="app-header">
          <div className="header-content">
            <h1>QR Printer System</h1>
            <div className="user-info">
              <span>Welcome, {username}</span>
              <span className="separator">|</span>
              <span>Printer: {selectedPrinter}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          <div className="success-message">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2>Login Berhasil!</h2>
            <p>Anda berhasil login dengan printer: <strong>{selectedPrinter}</strong></p>
            <p className="info-text">Sistem print QR sudah siap. Untuk testing print, silakan klik tombol "Test QR" di halaman login.</p>
            <button onClick={handleLogout} className="back-btn">
              Kembali ke Login
            </button>
          </div>
        </main>
      </div>
    </div>
  );
              <Printer size={24} /> QR Printer App
            </h1>
          </div>
          <nav className="app-nav">
            <button className={`nav-btn ${currentPage === "dashboard" ? "active" : ""}`} onClick={goToDashboard}>
              <BarChart3 size={16} />
              Dashboard
            </button>
            <button className={`nav-btn ${currentPage === "queue" ? "active" : ""}`} onClick={goToQueueService}>
              <Users size={16} />
              Queue Service
            </button>
          </nav>
          <div className="header-right">
            <span className="user-name">{username}</span>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
        {pageComponent}
      </div>
    </div>
  );
};

export default App;
