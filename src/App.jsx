import React, { useEffect, useState } from "react";
import Catalog from "./components/Catalog.jsx";

export default function App() {
  // URL del script de Google Apps Script (tu backend)
  const API_URL = "https://script.google.com/macros/s/AKfycbz2CDOe6-mhOBzTntmyTLU73kc-m2E3P50yyfWaumMCh-JuxarIoaUd4ceAKIPIHzM9/exec";

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar canciones desde Google Sheets
  useEffect(() => {
    async function fetchTracks() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();
        setTracks(data);
      } catch (e) {
        console.error("Error cargando canciones:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTracks();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container navrow">
          <div className="brand">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Logo"
              className="app-logo"
              style={{
                height: "70px",
                width: "auto",
                marginRight: "10px",
              }}
            />
            <h1>
              Mundo Audiovisual <span>Music Gallery</span>
            </h1>
          </div>
        </div>
      </nav>

      <main className="container" style={{ width: "100%" }}>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div style={{ fontWeight: 600, marginTop: 10 }}>Cargando...</div>
          </div>
        ) : (
          <Catalog tracks={tracks} />
        )}
      </main>
    </div>
  );
}
