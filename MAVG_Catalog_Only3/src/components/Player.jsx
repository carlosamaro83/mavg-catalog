import React, { useEffect, useMemo, useRef, useState } from "react";

function toDropboxDirect(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("dropbox.com")) {
      u.searchParams.delete("dl");
      u.searchParams.delete("raw");
      u.searchParams.set("raw", "1");
      u.hostname = "dl.dropboxusercontent.com";
      return u.toString();
    }
  } catch (e) {}
  return url;
}

export default function Player({ id, title, author, url }) {
  const ref = useRef(null);
  const ws = useRef(null);
  const [isReady, setReady] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const src = useMemo(() => toDropboxDirect(url), [url]);

  useEffect(() => {
    let isMounted = true;
    const initWaveform = () => {
      if (!ref.current || !window.WaveSurfer || !src) return;
      if (ws.current) {
        ws.current.destroy();
        ws.current = null;
      }

      const WaveSurfer = window.WaveSurfer;
      const inst = WaveSurfer.create({
        container: ref.current,
        waveColor: "rgba(231,235,240,0.35)",
        progressColor: "#00ff99",
        height: 120,
        barWidth: 2,
        barGap: 1.5,
        normalize: true,
        url: src,
      });

      ws.current = inst;

      inst.on("ready", () => {
        if (!isMounted) return;
        setReady(true);
        setDuration(inst.getDuration());
      });
      inst.on("timeupdate", (t) => isMounted && setTime(t));
      inst.on("finish", () => isMounted && setPlaying(false));
    };

    // Espera un pequeño delay para asegurar el contenedor DOM
    const timer = setTimeout(initWaveform, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (ws.current) ws.current.destroy();
      ws.current = null;
    };
  }, [src, id]);

  const toggle = () => {
    if (!ws.current) return;
    if (ws.current.isPlaying()) {
      ws.current.pause();
      setPlaying(false);
    } else {
      window.dispatchEvent(new CustomEvent("mavg-pause-others", { detail: id }));
      ws.current.play();
      setPlaying(true);
    }
  };

  const fmt = (s) => {
    const t = Math.max(0, s | 0);
    const m = (t / 60) | 0,
      sec = t % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div>
      <div ref={ref} />
      <div className="controls">
        <button className="btn primary" onClick={toggle} disabled={!isReady}>
          {isPlaying ? "⏸️ Pausa" : "▶️ Reproducir"}
        </button>
        <span className="time">
          {fmt(time)} / {fmt(duration)}
        </span>
        <a className="btn" href={src} download>
          ⬇️ Descargar
        </a>
      </div>
    </div>
  );
}
