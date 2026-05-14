const { useState, useEffect } = React;
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

      {/* Floating decorative balls */}
      {[
        { top: '8%',  left: '12%', size: 10, color: 'rgba(192,75,32,.55)',   dur: 4.2, delay: 0   },
        { top: '18%', left: '38%', size:  7, color: 'rgba(44,143,163,.50)',  dur: 5.8, delay: 1.1 },
        { top: '6%',  left: '58%', size: 13, color: 'rgba(74,103,65,.45)',   dur: 6.5, delay: 0.4 },
        { top: '22%', left: '82%', size:  8, color: 'rgba(192,75,32,.40)',   dur: 4.8, delay: 2.0 },
        { top: '12%', left: '92%', size: 11, color: 'rgba(44,143,163,.35)',  dur: 7.2, delay: 0.8 },
        { top: '30%', left: '5%',  size:  6, color: 'rgba(74,103,65,.40)',   dur: 5.1, delay: 1.5 },
        { top: '3%',  left: '75%', size:  9, color: 'rgba(192,75,32,.30)',   dur: 6.0, delay: 0.2 },
      ].map((b, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            top: b.top, left: b.left,
            width: b.size, height: b.size,
            borderRadius: '50%',
            background: b.color,
            boxShadow: `0 0 ${b.size * 2}px ${b.color}`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: b.dur, delay: b.delay, ease: 'easeInOut' }}
        />
      ))}

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
          <motion.div
            className="hp-card"
            initial={{ y: 0 }}
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <p className="hp-card-kicker food">Food & Nutrition</p>
            <p className="hp-card-name">Morris Community Food Pantry</p>
            <p className="hp-card-desc">Weekly food distributions for Morris County residents in need. No appointment required.</p>
            <div className="hp-card-tags">
              <span className="hp-tag rust">Food Pantry</span>
              <span className="hp-tag sage">Walk-in</span>
              <span className="hp-tag sand">Volunteers Needed</span>
            </div>
          </motion.div>

          <motion.div
            className="hp-card"
            initial={{ y: 0 }}
            animate={{ y: [6, -6, 6] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1 }}
          >
            <p className="hp-card-kicker safety">Safety & Shelter</p>
            <p className="hp-card-name">Domestic Violence Crisis Center</p>
            <p className="hp-card-desc">Confidential shelter, counseling, and safety planning for survivors of domestic violence.</p>
            <div className="hp-card-tags">
              <span className="hp-tag rust">24/7 Hotline</span>
              <span className="hp-tag sage">Counseling</span>
              <span className="hp-tag sand">Confidential</span>
            </div>
          </motion.div>

          <motion.div
            className="hp-card"
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          >
            <p className="hp-card-kicker home">Housing & Stability</p>
            <p className="hp-card-name">Morris Homeless Services</p>
            <p className="hp-card-desc">Emergency shelter, housing navigation, and case management for those facing homelessness.</p>
            <div className="hp-card-tags">
              <span className="hp-tag sage">Emergency Housing</span>
              <span className="hp-tag sand">Case Management</span>
            </div>
          </motion.div>
        </div>
      </div>
    </React.Fragment>
  );
}

const rootElement = document.getElementById('react-hero-root');
const root = ReactDOM.createRoot(rootElement);
root.render(<Hero />);
