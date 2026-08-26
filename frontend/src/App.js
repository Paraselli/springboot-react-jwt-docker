import React, { useState, useEffect } from "react";
import { authService, userService } from "./services/apiClient";

function App() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [activeUser, setActiveUser] = useState(localStorage.getItem("username") || "");
  
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [activeTab, setActiveTab] = useState("users"); // "users" or "create"
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [decodedClaims, setDecodedClaims] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  // Parse JWT claims when token changes
  useEffect(() => {
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setDecodedClaims(payload);
        }
      } catch (err) {
        console.error("Failed to parse token claims", err);
        setDecodedClaims(null);
      }
    } else {
      setDecodedClaims(null);
    }
  }, [token]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 5000);
  };

  const checkHealth = async () => {
    try {
      const res = await authService.health();
      if (res && res.status === "UP") {
        setBackendStatus("Online (Port 8080)");
      } else {
        setBackendStatus("Degraded");
      }
    } catch (err) {
      setBackendStatus("Offline / Unreachable");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(username, password);
      const jwtToken = res.token || res;
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("username", username);
      setToken(jwtToken);
      setActiveUser(username);
      showAlert("success", `Successfully logged in as "${username}"`);
      fetchUsers(jwtToken);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Login failed";
      showAlert("error", `Authentication Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setActiveUser("");
    setUsers([]);
    showAlert("success", "Logged out and cleared JWT token.");
  };

  const fetchUsers = async (customToken) => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
      showAlert("success", `Loaded ${data.length} registered user(s) via protected API`);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        showAlert("error", `Access Denied (${status}): Valid JWT Bearer token required`);
      } else {
        showAlert("error", `Failed to fetch users: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      showAlert("error", "Username and password are required");
      return;
    }
    setLoading(true);
    try {
      const created = await userService.create({
        username: newUsername,
        password: newPassword,
      });
      showAlert("success", `User "${created.username}" created successfully!`);
      setNewUsername("");
      setNewPassword("");
      setActiveTab("users");
      fetchUsers();
    } catch (err) {
      showAlert("error", `Error creating user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      showAlert("success", "JWT token copied to clipboard!");
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">🛡️</div>
          <div>
            <h1 className="brand-title">Spring Boot + React JWT Auth</h1>
            <p className="brand-subtitle">Stateless JWT Authentication & Dockerized Architecture</p>
          </div>
        </div>
        <div className="header-badges">
          <div className="badge badge-online">
            <span className="badge-dot"></span>
            Backend: {backendStatus}
          </div>
        </div>
      </header>

      {/* Alert banner */}
      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left Column: Auth / Token Card */}
        <div>
          <div className="glass-card animate-fade">
            <h2 className="card-title">🔐 Authentication Portal</h2>
            <p className="card-subtitle">Generate a signed JWT token with Spring Security</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <div className="quick-fill-row">
                  <span>Quick Test:</span>
                  <button
                    type="button"
                    className="quick-fill-btn"
                    onClick={() => { setUsername("admin"); setPassword("admin"); }}
                  >
                    admin / admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Authenticating..." : token ? "Re-Authenticate" : "Generate JWT Token"}
              </button>
            </form>

            {/* Active Token Details */}
            {token && (
              <div className="token-card animate-fade">
                <div className="token-header">
                  <span className="token-header-title">
                    <span>🔑</span> Active Bearer Token
                  </span>
                  <span className="badge badge-online">VALID</span>
                </div>

                <div className="token-display">
                  {token}
                </div>

                <div className="token-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={copyToken}
                  >
                    📋 Copy Token
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>

                {/* Decoded Claims Preview */}
                {decodedClaims && (
                  <div className="claims-grid">
                    <div className="claim-item">
                      <div className="claim-key">Subject</div>
                      <div className="claim-value">{decodedClaims.sub || activeUser}</div>
                    </div>
                    <div className="claim-item">
                      <div className="claim-key">Issued At</div>
                      <div className="claim-value">
                        {decodedClaims.iat ? new Date(decodedClaims.iat * 1000).toLocaleTimeString() : "N/A"}
                      </div>
                    </div>
                    <div className="claim-item">
                      <div className="claim-key">Expires</div>
                      <div className="claim-value">
                        {decodedClaims.exp ? new Date(decodedClaims.exp * 1000).toLocaleTimeString() : "24h"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Protected APIs & User Data */}
        <div>
          <div className="glass-card animate-fade">
            <h2 className="card-title">⚡ Protected API Explorer</h2>
            <p className="card-subtitle">Endpoints secured by Spring Security filter chain (`/api/users`)</p>

            {/* Navigation Tabs */}
            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
                onClick={() => { setActiveTab("users"); if (token) fetchUsers(); }}
              >
                👥 User List ({users.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
                onClick={() => setActiveTab("create")}
              >
                ➕ Register User
              </button>
            </div>

            {/* Tab 1: User List */}
            {activeTab === "users" && (
              <div className="animate-fade">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => fetchUsers()}
                    disabled={loading}
                  >
                    🔄 Refresh Users
                  </button>
                  
                  {!token && (
                    <span style={{ fontSize: "0.8rem", color: "var(--accent-rose)", alignSelf: "center" }}>
                      ⚠️ Login required to access protected endpoint
                    </span>
                  )}
                </div>

                <div className="table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((u, idx) => (
                          <tr key={u.id || idx}>
                            <td><code>#{u.id || idx + 1}</code></td>
                            <td><strong>{u.username}</strong></td>
                            <td><span className="badge badge-online">Active</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">
                            <div className="empty-state">
                              <div className="empty-icon">📭</div>
                              <p>{token ? "No users found in database yet. Add one below!" : "Authenticate with JWT to load user records."}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Create User */}
            {activeTab === "create" && (
              <form onSubmit={handleCreateUser} className="animate-fade">
                <div className="form-group">
                  <label className="form-label">New Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. john_doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="e.g. secret123"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Save User to Database"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;