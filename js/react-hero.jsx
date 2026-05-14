const { useState } = React;
const motion = (window.Motion && window.Motion.motion) || (window.framerMotion && window.framerMotion.motion) || (window.FramerMotion && window.FramerMotion.motion);

function Hero() {
  if (!motion) {
    return <div style={{padding: "4rem", color: "white"}}>Loading animations... (If this persists, Framer Motion failed to load)</div>;
  }
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `directory.html?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <React.Fragment>
      {/* ── Orbit rings (rotate only — fine for Framer Motion) ── */}
      <div className="hero-orbits">
        <motion.span
          className="orbit orbit-one"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          <i></i>
        </motion.span>
        <motion.span
          className="orbit orbit-two"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        >
          <i></i>
        </motion.span>
      </div>

      <div className="hero-orbits hero-orbits-sm">
        <motion.span
          className="orbit orbit-sm-one"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
        >
          <i></i>
        </motion.span>
        <motion.span
          className="orbit orbit-sm-two"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 11, ease: "linear" }}
        >
          <i></i>
        </motion.span>
      </div>

      {/* ── Floating decorative balls — pure CSS, no JS ── */}
      <span className="hero-ball" style={{top:'10%', left:'4%',  width:'14px', height:'14px', background:'rgba(192,75,32,.50)',  animationName:'hball', animationDuration:'5s',  animationDelay:'0s'}}></span>
      <span className="hero-ball" style={{top:'28%', left:'9%',  width:'7px',  height:'7px',  background:'rgba(184,154,106,.40)', animationName:'hball', animationDuration:'7.2s', animationDelay:'1.3s'}}></span>
      <span className="hero-ball" style={{top:'5%',  left:'34%', width:'9px',  height:'9px',  background:'rgba(74,103,65,.45)',   animationName:'hball', animationDuration:'6.1s', animationDelay:'0.6s'}}></span>
      <span className="hero-ball" style={{top:'14%', left:'50%', width:'5px',  height:'5px',  background:'rgba(192,75,32,.30)',   animationName:'hball', animationDuration:'4.5s', animationDelay:'2.2s'}}></span>
      <span className="hero-ball" style={{top:'7%',  left:'70%', width:'11px', height:'11px', background:'rgba(184,154,106,.45)', animationName:'hball', animationDuration:'5.8s', animationDelay:'0.9s'}}></span>
      <span className="hero-ball" style={{top:'20%', left:'88%', width:'16px', height:'16px', background:'rgba(74,103,65,.38)',   animationName:'hball', animationDuration:'6.8s', animationDelay:'0.2s'}}></span>
      <span className="hero-ball" style={{top:'35%', left:'94%', width:'6px',  height:'6px',  background:'rgba(192,75,32,.35)',   animationName:'hball', animationDuration:'4.9s', animationDelay:'1.8s'}}></span>
      <span className="hero-ball" style={{top:'55%', left:'2%',  width:'8px',  height:'8px',  background:'rgba(184,154,106,.35)', animationName:'hball', animationDuration:'6.4s', animationDelay:'0.4s'}}></span>

      <div className="container hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="hero-eyebrow">Morris County, New Jersey</p>
          <h1>Find Help.<br/><em>Give Back.</em><br/>Strengthen Community.</h1>
          <p className="hero-sub">
            CareMap Morris connects residents to trusted local nonprofits and services — supporting families facing food insecurity, women in crisis, neighbors experiencing homelessness, and more.
          </p>

          <div className="hero-ctas">
            <a className="btn btn-primary" href="directory.html">Find Help →</a>
            <a className="btn btn-sage" href="donate-volunteer.html">Give Back →</a>
            <a className="btn btn-ghost" href="submit.html">Submit a Resource</a>
          </div>

          <div className="hero-search">
            <label htmlFor="heroSearch">Search resources</label>
            <form className="hero-search-row" onSubmit={handleSearch}>
              <input
                id="heroSearch"
                name="q"
                type="search"
                placeholder='Try: "food pantry", "shelter", "counseling"…'
                autoComplete="off"
                aria-label="Search community resources"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" id="heroSearchBtn">Search</button>
            </form>
            <p className="hero-search-hint">Searching takes you straight into the Directory with results filtered.</p>
          </div>
        </motion.div>

        {/* ── Right panel ── */}
        <div className="hero-panel" aria-hidden="true">
          <div className="hp-card">
            <p className="hp-card-kicker food">Food &amp; Nutrition</p>
            <p className="hp-card-name">Morris Community Food Pantry</p>
            <p className="hp-card-desc">Weekly food distributions for Morris County residents in need. No appointment required.</p>
            <div className="hp-card-tags">
              <span className="hp-tag rust">Food Pantry</span>
              <span className="hp-tag sage">Walk-in</span>
              <span className="hp-tag sand">Volunteers Needed</span>
            </div>
          </div>

          <div className="hp-card">
            <p className="hp-card-kicker safety">Safety &amp; Shelter</p>
            <p className="hp-card-name">Domestic Violence Crisis Center</p>
            <p className="hp-card-desc">Confidential shelter, counseling, and safety planning for survivors of domestic violence.</p>
            <div className="hp-card-tags">
              <span className="hp-tag rust">24/7 Hotline</span>
              <span className="hp-tag sage">Counseling</span>
              <span className="hp-tag sand">Confidential</span>
            </div>
          </div>

          <div className="hp-card">
            <p className="hp-card-kicker home">Housing &amp; Stability</p>
            <p className="hp-card-name">Morris Homeless Services</p>
            <p className="hp-card-desc">Emergency shelter, housing navigation, and case management for those facing homelessness.</p>
            <div className="hp-card-tags">
              <span className="hp-tag sage">Emergency Housing</span>
              <span className="hp-tag sand">Case Management</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

const rootElement = document.getElementById('react-hero-root');
const root = ReactDOM.createRoot(rootElement);
root.render(<Hero />);
