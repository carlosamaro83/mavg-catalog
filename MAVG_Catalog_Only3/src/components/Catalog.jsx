import React, { useMemo, useState } from "react";
import Player from "./Player.jsx";

const ALL_GENRES = ["Cinematico","Epico","Rock","Pop","Electronico","Ambient","Hip-Hop","Acustico"];

function normalizeText(t){
  return String(t||"").normalize('NFD').replace(/\p{Diacritic}/gu,''); // quita acentos para buscar
}

export default function Catalog({ tracks }){
  const [query,setQuery]=useState("");
  const [selectedGenre,setSelectedGenre]=useState(null);

  const filtered=useMemo(()=>{
    let list=tracks||[];
    const norm = (v)=> normalizeText(v).toLowerCase();
    if(selectedGenre) list=list.filter(t=> norm(t.genres).includes(norm(selectedGenre)));
    const q=norm(query.trim());
    if(q){
      list=list.filter(t=>([t.title,t.author,t.url,t.genres,t.moods,t.themes,t.instruments,t.vocals]
        .map(x=>norm(x)).join(" ").includes(q)));
    }
    return list;
  },[tracks,query,selectedGenre]);

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{fontWeight:700,marginBottom:8}}>Filtrar por genero</div>
        <div className="genre-filter">
          {ALL_GENRES.map(g=>(
            <button key={g} className="btn"
              style={{background:selectedGenre===g?"var(--accent-weak)":"",borderColor:selectedGenre===g?"var(--accent)":""}}
              onClick={()=>setSelectedGenre(selectedGenre===g?null:g)}>
              {selectedGenre===g?"✅ ":""}{g}
            </button>
          ))}
          {selectedGenre&&<button className="btn" onClick={()=>setSelectedGenre(null)}>✖️ Limpiar</button>}
        </div>
      </div>

      <div className="searchbar">
        <input className="input" placeholder="Buscar por titulo, autor o etiquetas..." value={query} onChange={e=>setQuery(e.target.value)} />
        <span className="badge">Total: {filtered.length}</span>
      </div>

      <div className="grid-vertical">
        {filtered.map(t=>(
          <div className="card track-card" key={t.id}>
            <div className="track-header">
              <div>
                <div style={{fontWeight:700,fontSize:16}}>{t.title || "Sin titulo"}</div>
                <div style={{fontSize:12,color:"var(--subtext)"}}>{t.author || "Autor desconocido"}</div>
              </div>
              <a className="btn" href={t.url} target="_blank" rel="noreferrer">Abrir</a>
            </div>

            <Player id={t.id} title={t.title} author={t.author} url={t.url} />

            <div className="meta">
              {t.genres && <span className="tag">🎧 {t.genres}</span>}
              {t.moods && <span className="tag">🎭 {t.moods}</span>}
              {t.themes && <span className="tag">🌍 {t.themes}</span>}
              {t.instruments && <span className="tag">🎹 {t.instruments}</span>}
              {t.vocals && <span className="tag">🎙️ {t.vocals}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
