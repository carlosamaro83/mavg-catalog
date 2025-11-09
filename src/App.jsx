import React, { useEffect, useState } from "react";
import Catalog from "./components/Catalog.jsx";

const API_URL = "https://script.google.com/macros/s/AKfycbzj5Eh2ZNdjpfyNYsntue9_47JxjI0sqltlAwWppjHS3v_l_lrvMXjSuESXH8kXwqY/exec";

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { cache: "no-store" });
        const data = await res.json();
        setTracks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando catalogo:", e);
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
            <img src="/logo.png" alt="Logo" />
            <h1>Mundo Audiovisual <span>Music Gallery</span></h1>
          </div>
          <div style={{opacity:.6,fontSize:12}}>Catalogo online</div>
        </div>
      </nav>

      <main className="container" style={{ width: "100%" }}>
        {loading ? (
          <div className="card" style={{ textAlign: "center", padding: 24 }}>
            <div className="loader">
              <div className="spinner" />
              <div style={{ fontWeight: 700 }}>Cargando...</div>
            </div>
          </div>
        ) : (
          <Catalog tracks={tracks} />
        )}

        <div className="footer-hint">
          Alimenta el catalogo desde tu <span className="kbd">Google Form</span> vinculado.
        </div>
      </main>
    </div>
  );
}
