import React, { useEffect, useState } from "react";
import Catalog from "./components/Catalog.jsx";

export default function App() {
  // ✅ Tu URL oficial de Google Apps Script
  const API_URL =
    "https://script.google.com/macros/s/AKfycbzj5Eh2ZNdjpfyNYsntue9_47JxjI0sqltlAwWppjHS3v_l_lrvMXjSuESXH8kXwqY/exec";

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar canciones desde Google Sheets
  useEffect(() => {
    async function fetchTracks() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        const data = await res.json();
        setTracks(data);
      } catch (e) {
        console.error("❌ Error cargando canciones:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();

    // 🔁 Opcional: refrescar cada 60 segundos automáticamente
    const interval = setInterval(fetchTracks, 60000);
    return () => clearInterval(interval);
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
                height: "80px",
                width: "auto",
                marginRight: "15px",
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
