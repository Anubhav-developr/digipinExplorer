import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, ArrowRightLeft, Copy, Check, LocateFixed, ArrowUpRight, ShieldCheck, Compass, ScanLine, Navigation, Github, Menu, X, Sparkles, ChevronDown, ExternalLink } from 'lucide-react';
import './style.css';

function App() {
  const [mode, setMode] = useState('encode');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const reset = (next) => { setMode(next); setResult(null); setError(''); setCopied(false); };
 
async function submit(e) {
  e?.preventDefault();
  setError("");
  setResult(null);
  setBusy(true);

  try {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );

    const endpoint =
      mode === "encode"
        ? `${API_BASE}/api/digipin/encode`
        : `${API_BASE}/api/digipin/decode`;

    const payload =
      mode === "encode"
        ? {
            latitude: Number(lat),
            longitude: Number(lon),
          }
        : {
            digipin: pin.trim().toUpperCase(),
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Backend returned an invalid response (HTTP ${response.status}). Check your Render URL and deployment.`,
      );
    }

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    setResult(data);
  } catch (err) {
    setError(err.message || "Could not reach the DIGIPIN service.");
  } finally {
    setBusy(false);
  }
}

  function locate() {
    setError('');
    if (!navigator.geolocation) { setError('Your browser does not support location.'); return; }
    navigator.geolocation.getCurrentPosition(p => { setLat(p.coords.latitude.toFixed(6)); setLon(p.coords.longitude.toFixed(6)); }, () => setError('Location access was denied. Allow location permission and try again.'), { enableHighAccuracy:true, timeout:10000 });
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1600); }
    catch { setError('Clipboard access is unavailable. Please copy the text manually.'); }
  }
  const coords = result && result.latitude ? `${result.latitude}, ${result.longitude}` : '';
  return <div className="app-shell">
    <div className="announcement"><span className="flag-dot"></span> A digital addressing initiative inspired by India’s geospatial future <ArrowUpRight size={13}/></div>
    <header className="header">
      <a className="brand" href="#" aria-label="DIGIPIN Explorer home">
        <div className="brand-mark"><ScanLine size={25}/></div>
        <div><div className="brand-name">DIGIPIN<span>EXPLORER</span></div><div className="brand-sub">A location, made precise.</div></div>
      </a>
      <nav className={mobileOpen ? 'nav nav-open' : 'nav'}>
        <a href="#explore" onClick={()=>setMobileOpen(false)}>Explore</a><a href="#how-it-works" onClick={()=>setMobileOpen(false)}>How it works</a><a href="#about" onClick={()=>setMobileOpen(false)}>About DIGIPIN</a>
        <a className="nav-source" href="https://github.com/INDIAPOST-gov/digipin" target="_blank" rel="noreferrer">Official source <ExternalLink size={14}/></a>
      </nav>
      <button className="mobile-toggle" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-icon"><Compass size={14}/></span> THE NEW LANGUAGE OF LOCATION</div>
          <h1>Every place has a story.<br/><span>Give it an address.</span></h1>
          <p className="hero-description">Turn coordinates into a precise digital address. Explore India’s geospatial grid with DIGIPIN — built to make every location easier to identify and share.</p>
          <div className="hero-actions"><a className="button button-primary" href="#explore">Find your DIGIPIN <ArrowRightLeft size={17}/></a><a className="text-link" href="#how-it-works">Discover how it works <ArrowUpRight size={16}/></a></div>
          <div className="trust-row"><div className="trust-icon"><ShieldCheck size={17}/></div><span>Open-source technology</span><i></i><span>10-character location code</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a digital location grid">
          <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
          <div className="map-grid">
            {Array.from({length:81},(_,i)=><div key={i} className={`grid-cell ${[13,14,22,23,24,31,32,33,40,41,42,49,50,58].includes(i)?'cell-lit':''} ${[31,32,40,41,42,49,50].includes(i)?'cell-hot':''}`}></div>)}
          </div>
          <div className="pin-bubble"><MapPin size={23} fill="currentColor"/></div>
          <div className="coordinate-chip"><span className="live-dot"></span><div><small>LOCATION FOUND</small><b>28.6139° N, 77.2090° E</b></div></div>
          <div className="code-chip"><div className="code-icon"><ScanLine size={18}/></div><div><small>YOUR DIGITAL ADDRESS</small><b>DIGIPIN <span>PREVIEW</span></b></div><div className="code-bars"><i/><i/><i/><i/><i/><i/><i/></div></div>
          <div className="art-label label-top">INDIA · GRID 01</div><div className="art-label label-bottom">PRECISION IN EVERY POINT</div>
        </div>
      </section>

      <section className="explorer-section" id="explore">
        <div className="section-heading"><div><div className="eyebrow">YOUR LOCATION, DECODED</div><h2>Explore DIGIPIN</h2><p>Generate a code from coordinates, or decode a code to find its location.</p></div><div className="section-stamp"><Sparkles size={16}/> Simple. Precise. Shareable.</div></div>
        <div className="workspace">
          <div className="form-panel">
            <div className="tabs"><button className={mode==='encode'?'tab active':'tab'} onClick={()=>reset('encode')}><MapPin size={16}/> Generate DIGIPIN</button><button className={mode==='decode'?'tab active':'tab'} onClick={()=>reset('decode')}><ScanLine size={16}/> Decode a code</button></div>
            <form onSubmit={submit}>
              {mode==='encode' ? <>
                <div className="field-heading"><span className="step-number">01</span><div><b>Enter coordinates</b><small>Use a latitude and longitude pair.</small></div><button type="button" className="locate-button" onClick={locate}><LocateFixed size={15}/> Use my location</button></div>
                <div className="input-grid">
                  <label>Latitude <span>° N / S</span><input inputMode="decimal" value={lat} onChange={e=>setLat(e.target.value)} placeholder="e.g. 28.6139" required/></label>
                  <label>Longitude <span>° E / W</span><input inputMode="decimal" value={lon} onChange={e=>setLon(e.target.value)} placeholder="e.g. 77.2090" required/></label>
                </div>
                <div className="input-hint"><span className="hint-dot"></span> India grid coverage: approximately 2.5°–38.5° N and 63.5°–99.5° E.</div>
              </> : <>
                <div className="field-heading"><span className="step-number">01</span><div><b>Enter a DIGIPIN code</b><small>Use the continuous 10-character code.</small></div></div>
                <label className="full-label">DIGIPIN <span>10 characters</span><input className="pin-input" value={pin} onChange={e=>setPin(e.target.value.toUpperCase().replace(/[^23456789CJKLMPFT]/g,''))} placeholder="e.g. 4T396F42L7" maxLength={10} required/></label>
                <div className="input-hint"><span className="hint-dot"></span> Accepted characters: 2–9, C, J, K, L, M, P, F and T.</div>
              </>}
              {error && <div className="error-message" role="alert">{error}</div>}
              <button className="button button-submit" type="submit" disabled={busy}>{busy?'Working…':mode==='encode'?'Generate my DIGIPIN':'Find this location'} <ArrowUpRight size={17}/></button>
            </form>
          </div>
          <div className="result-panel">
            {!result ? <div className="empty-result"><div className="result-illustration"><div className="result-ring ring-a"></div><div className="result-ring ring-b"></div><div className="result-pin"><MapPin size={28}/></div><span className="spark spark-a">✳</span><span className="spark spark-b">✦</span></div><div className="result-kicker">YOUR RESULT WILL APPEAR HERE</div><h3>Ready when you are.</h3><p>Enter your details and we’ll translate your location into a digital address.</p><div className="result-footer"><span><ShieldCheck size={14}/> Processed using the official open-source algorithm</span></div></div> :
              <div className="success-result"><div className="success-top"><span className="success-badge"><Check size={14}/> SUCCESS</span><span className="result-kicker">YOUR LOCATION IS READY</span></div>
                {mode==='encode' ? <><div className="result-kicker result-title">YOUR DIGIPIN</div><div className="generated-pin">{result.digipin}</div><p className="result-explain">Your 10-character digital location code is ready to copy and share.</p><button className="button copy-button" onClick={()=>copy(result.digipin)}><Copy size={16}/>{copied?'Copied!':'Copy DIGIPIN'}</button><div className="result-meta"><span>COORDINATES</span><b>{Number(lat).toFixed(6)}, {Number(lon).toFixed(6)}</b></div></> :
                <><div className="result-kicker result-title">LOCATION COORDINATES</div><div className="decoded-coords">{Number(result.latitude).toFixed(6)}<small>LAT</small></div><div className="decoded-coords">{Number(result.longitude).toFixed(6)}<small>LON</small></div><p className="result-explain">These coordinates represent the centre point of the DIGIPIN grid cell.</p><button className="button copy-button" onClick={()=>copy(coords)}><Copy size={16}/>{copied?'Copied!':'Copy coordinates'}</button><a className="map-link" href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`} target="_blank" rel="noreferrer"><Navigation size={15}/> Open in Google Maps <ArrowUpRight size={14}/></a></>}
              </div>}
          </div>
        </div>
      </section>

      <section className="steps-section" id="how-it-works"><div className="eyebrow">A SMALL CODE. A BIG POSSIBILITY.</div><h2>Location, simplified in <span>three steps.</span></h2><div className="steps-grid"><article className="step-card"><div className="step-visual visual-one"><MapPin size={26}/><span className="mini-coord">28.6139° N</span></div><span className="step-label">STEP 01</span><h3>Choose a place</h3><p>Start with coordinates or use your device’s current location.</p></article><article className="step-card"><div className="step-visual visual-two"><ScanLine size={27}/><div className="mini-code">4T3 · 96F · 42L7</div></div><span className="step-label">STEP 02</span><h3>Generate a DIGIPIN</h3><p>The official open-source algorithm maps the point into a compact code.</p></article><article className="step-card"><div className="step-visual visual-three"><Navigation size={25}/><div className="mini-map-dot"></div><div className="mini-route"></div></div><span className="step-label">STEP 03</span><h3>Share with confidence</h3><p>Copy your code or decode an existing DIGIPIN into coordinates.</p></article></div></section>

      <section className="about-banner" id="about"><div className="about-emblem"><ScanLine size={30}/></div><div className="about-copy"><div className="eyebrow">BUILT ON OPEN SOURCE</div><h2>Designed for a more connected India.</h2><p>DIGIPIN is a geospatial addressing grid initiative by the Department of Posts, Government of India. This independent explorer uses the published open-source implementation to make its encoding and decoding functions easier to try.</p><a href="https://github.com/INDIAPOST-gov/digipin" target="_blank" rel="noreferrer" className="about-link">Explore the official repository <ArrowUpRight size={16}/></a></div><div className="about-orbit"></div></section>
    </main>
    <footer className="footer"><a className="footer-brand" href="#"><span className="brand-mark small"><ScanLine size={17}/></span><b>DIGIPIN EXPLORER</b></a><span>Independent community interface · Not an official India Post website</span><a href="https://github.com/INDIAPOST-gov/digipin" target="_blank" rel="noreferrer"><Github size={15}/> Open-source foundation</a></footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App />);