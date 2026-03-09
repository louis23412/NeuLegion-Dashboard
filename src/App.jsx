import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

const ProgressBar = ({ value, label, color = '#ffaa33', max = 100 }) => (
  <div className="progress-container">
    <div className="progress-label">
      {label} <span className="progress-value">{value}%</span>
    </div>
    <div className="progress-bar-outer">
      <div
        className="progress-bar-inner"
        style={{
          width: `${Math.min(Math.max((value / max) * 100, 0), 100)}%`,
          background: `linear-gradient(to right, ${color})`
        }}
      />
    </div>
  </div>
);

const ControllerCompactCard = ({ controller, type, onViewDetails }) => {
  const isPositive = type === 'positive';
  const probColor = controller.stats.probability > 70 ? 'green' : controller.stats.probability > 45 ? 'accent' : 'red';

  return (
    <div className={`controller-compact ${isPositive ? 'positive' : 'negative'}`}>
      <div className="center">
        <div 
          className="id clickable" 
          onClick={() => navigator.clipboard.writeText(controller.id)}
          title="Click to copy ID"
        >
          {controller.id} ({controller.params.population})
        </div>
      </div>

      <div className="key-metrics">
        <div className="stat-item">
          <span className="stat-label">Accuracy Score</span>
          <span className="stat-value">{controller.stats.accuracyScore}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Probability</span>
          <span className={`stat-value ${probColor}`}>{controller.stats.probability} %</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{controller.signalSpeed} s</span>
        </div>
      </div>

      <div className="center">
        <button
          className="details-btn"
          onClick={() => onViewDetails(controller, type)}
        >
          View Full Details
        </button>
      </div>
    </div>
  );
};

const FullControllerDetails = ({ controller, type }) => {
  const isPositive = type === 'positive';

  return (
    <div className="controller">
      <div className="modal-section">
        <h4 className="section-title">Parameters</h4>
        <div className="stat-group">
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Population</span><span className="stat-value">{controller.params.population}</span></div>
            <div className="stat-item"><span className="stat-label">Cache</span><span className="stat-value">{controller.params.cacheSize}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Input size</span><span className="stat-value">{controller.params.inputSize}</span></div>
            <div className="stat-item"><span className="stat-label">Candles used</span><span className="stat-value">{controller.params.candlesUsed}</span></div>
            <div className="stat-item"><span className="stat-label">Indicators used</span><span className="stat-value">{controller.params.indicatorsUsed}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Atr factor</span><span className="stat-value">{controller.params.atrFactor}×</span></div>
            <div className="stat-item"><span className="stat-label">Stop factor</span><span className="stat-value">{controller.params.stopFactor}×</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Min / Max move %</span><span className="stat-value">{controller.params.minMove} / {controller.params.maxMove} %</span></div>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h4 className="section-title">Current Position</h4>
        <div className="stat-group">
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Entry price</span><span className="stat-value">{controller.price.entryPrice}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Exit price</span>
              <span className="stat-value">{controller.price.exitPrice} ({isPositive ? '+' : '-'}{controller.price.profitPct} %)</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Stop loss</span>
              <span className="stat-value">{controller.price.stopLoss} ({isPositive ? '-' : '+'}{controller.price.stopLossPct} %)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h4 className="section-title">Performance Stats</h4>
        <div className="stat-group">
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Confidence</span>
              <span className="stat-value">{controller.stats.lifetimeMinProb} &lt; {controller.stats.probability} % &gt; {controller.stats.lifetimeMaxProb}</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Accuracy score</span>
              <span className="stat-value">{controller.stats.lifetimeMaxScore} &lt; {controller.stats.accuracyScore} &gt; {controller.stats.lifetimeMinScore}</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Trade accuracy</span><span className="stat-value">{controller.stats.tradeAccuracy} %</span></div>
            <div className="stat-item"><span className="stat-label">Probability accuracy</span><span className="stat-value">{controller.stats.probabilityAccuracy} %</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Training steps</span><span className="stat-value">{controller.stats.trainingSteps}</span></div>
            <div className="stat-item"><span className="stat-label">Training skipped</span><span className="stat-value">{controller.stats.skippedTraining}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Open simulations</span><span className="stat-value">{controller.stats.openSimulations}</span></div>
            <div className="stat-item"><span className="stat-label">Pending closed trades</span><span className="stat-value">{controller.stats.pendingClosedTrades}</span></div>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h4 className="section-title">Memory &amp; Hive</h4>
        <div className="stat-group">
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Memory connections</span><span className="stat-value">{controller.memory.memoryConnections}</span></div>
            <div className="stat-item"><span className="stat-label">Controller memories</span><span className="stat-value">{controller.memory.controllerMemories}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Memories sent</span><span className="stat-value">{controller.memory.totalSent}</span></div>
            <div className="stat-item"><span className="stat-label">Memories received</span><span className="stat-value">{controller.memory.totalReceived}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Last injected</span><span className="stat-value">{controller.memory.lastInjectedTotal} (+{controller.memory.lastInjectionRatio} %)</span></div>
            <div className="stat-item"><span className="stat-label">Per member</span><span className="stat-value">{controller.memory.lastMemoriesPerMember}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Peer broadcasted</span><span className="stat-value">{controller.memory.lastBroadcastPeerMemories}</span></div>
            <div className="stat-item"><span className="stat-label">Vault supplied</span><span className="stat-value">{controller.memory.lastBroadcastVaultMemories}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [legionState, setLegionState] = useState({
    consensus: {},
    controllers: {},
    memoryVaultStats: {},
    overview: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedController, setSelectedController] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('accuracy');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://10.97.65.148:3001');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      setLegionState(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, 6000);
    }
    return () => clearInterval(interval);
  }, [fetchData, autoRefresh]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        fetchData();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, fetchData]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedController(null);
    setSelectedType('');
  };

  const openModal = (controller, type) => {
    setSelectedController(controller);
    setSelectedType(type);
    setShowModal(true);
  };

  const computeAggregates = (voters = []) => {
    if (!voters.length) return { bestScore: 0, worstScore: 0, avgScore: 0, fastest: 0, slowest: 0, avgSpeed: 0 };
    const scores = voters.map(v => v.stats.accuracyScore);
    const speeds = voters.map(v => v.signalSpeed);
    return {
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
      avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
      fastest: Math.min(...speeds),
      slowest: Math.max(...speeds),
      avgSpeed: (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2)
    };
  };

  const positiveVoters = useMemo(() => {
    const voters = legionState.controllers?.positive?.voters || [];
    const filtered = voters.filter(v =>
      v.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sortOption === 'accuracy') return b.stats.accuracyScore - a.stats.accuracyScore;
      if (sortOption === 'probability') return b.stats.probability - a.stats.probability;
      return a.signalSpeed - b.signalSpeed;
    });
  }, [legionState, searchTerm, sortOption]);

  const negativeVoters = useMemo(() => {
    const voters = legionState.controllers?.negative?.voters || [];
    const filtered = voters.filter(v =>
      v.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sortOption === 'accuracy') return b.stats.accuracyScore - a.stats.accuracyScore;
      if (sortOption === 'probability') return b.stats.probability - a.stats.probability;
      return a.signalSpeed - b.signalSpeed;
    });
  }, [legionState, searchTerm, sortOption]);

  const posAgg = useMemo(() => computeAggregates(legionState.controllers?.positive?.voters), [legionState]);
  const negAgg = useMemo(() => computeAggregates(legionState.controllers?.negative?.voters), [legionState]);

  const exportData = () => {
    const dataStr = JSON.stringify(legionState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NeuLegion_${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyControllerJSON = () => {
    if (!selectedController) return;
    navigator.clipboard.writeText(JSON.stringify(selectedController, null, 2));
    alert('Controller JSON copied to clipboard!');
  };

  return (
    <div className="main">
      <div className="premium-header">
        <div className="header-top">
          <h1>NeuLegion</h1>
          <div className="live-controls">
            <label className="live-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
              />
              <span className={`live-dot ${autoRefresh ? 'pulse' : ''}`} /> AUTO-REFRESH
            </label>
            <button className="refresh-btn" onClick={fetchData} disabled={loading}>
              {loading ? '⟳ REFRESHING' : '⟳ REFRESH'}
            </button>
            <button className="export-btn" onClick={exportData}>
              ↓ EXPORT JSON
            </button>
          </div>
        </div>
        <p>
          Total population: <span className="stat-value">{legionState.overview.population || 0}</span> • 
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
        </p>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error} 
          <button onClick={fetchData}>RETRY</button>
        </div>
      )}

      <div className="overview-section">
        <div className="border">
          <div className="stat-group">
            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className="stat-value">{legionState.overview.status || '—'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Candle</span>
                <span className="stat-value">{legionState.overview.candleCounter || 0}</span>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-label">Last update</span>
                <span className="stat-value">{legionState.overview.updateTime || 0} s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Runtime</span>
                <span className="stat-value">{legionState.overview.runtimeSeconds || 0} s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border">
          <div className="stat-group">
            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-label">Direction</span>
                <span className={`stat-value ${legionState.consensus.direction === 'BUY' ? 'green' : 'red'}`}>
                  {legionState.consensus.direction || '—'}
                </span>
              </div>
              <div className="stat-item">
                <ProgressBar
                  value={legionState.consensus.confidence || 0}
                  color={`${legionState.consensus.direction === 'BUY'? '#22c55e' : '#ef4444'}`}
                />
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Entry</span><span className="stat-value">{legionState.consensus.entryPrice || '—'}</span></div>
              <div className="stat-item">
                <span className="stat-label">Exit</span>
                <span className="stat-value">
                  {legionState.consensus.exitPrice || '—'} ({legionState.consensus.direction === 'BUY' ? '+' : '-'}{legionState.consensus.profitPct || 0} %)
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Stop Loss</span>
                <span className="stat-value">
                  {legionState.consensus.stopLoss || '—'} ({legionState.consensus.direction === 'BUY' ? '-' : '+'}{legionState.consensus.stopLossPct || 0} %)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border memory-section">
          <div className="stat-group">
            <ProgressBar
              value={legionState.memoryVaultStats.vaultFillPercentage || 0}
              label="Vault Fill"
              color="#ffaa33"
            />
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Total vault memories</span><span className="stat-value">{legionState.memoryVaultStats.totalVaultMemories || 0}</span></div>
            </div>
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Positive volatile</span><span className="stat-value green">{legionState.memoryVaultStats.volatilePos || 0}</span></div>
              <div className="stat-item"><span className="stat-label">Negative volatile</span><span className="stat-value red">{legionState.memoryVaultStats.volatileNeg || 0}</span></div>
              <div className="stat-item"><span className="stat-label">Total volatile</span><span className="stat-value">{legionState.memoryVaultStats.totalVolatile || 0}</span></div>
            </div>
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Positive core</span><span className="stat-value green">{legionState.memoryVaultStats.corePos || 0}</span></div>
              <div className="stat-item"><span className="stat-label">Negative core</span><span className="stat-value red">{legionState.memoryVaultStats.coreNeg || 0}</span></div>
              <div className="stat-item"><span className="stat-label">Total core</span><span className="stat-value">{legionState.memoryVaultStats.totalCore || 0}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="controllers-controls">
        <input
          type="text"
          placeholder="Search by controller ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="sort-select">
          <option value="accuracy">Sort: Accuracy Score ↓</option>
          <option value="probability">Sort: Probability ↓</option>
          <option value="speed">Sort: Signal Speed ↑</option>
        </select>
      </div>

      <div className="controllers">
        <div className="positive border">
          <h3>Positive: <span className="count">({positiveVoters.length})</span></h3>
          <div className="controller-overview">
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Best score</span><span className="stat-value">{posAgg.bestScore}</span></div>
              <div className="stat-item"><span className="stat-label">Worst score</span><span className="stat-value">{posAgg.worstScore}</span></div>
              <div className="stat-item"><span className="stat-label">Average score</span><span className="stat-value">{posAgg.avgScore}</span></div>
            </div>
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Fastest</span><span className="stat-value">{posAgg.fastest} s</span></div>
              <div className="stat-item"><span className="stat-label">Slowest</span><span className="stat-value">{posAgg.slowest} s</span></div>
              <div className="stat-item"><span className="stat-label">Average speed</span><span className="stat-value">{posAgg.avgSpeed} s</span></div>
            </div>
          </div>

          <div className="controller-grid">
            {positiveVoters.map(x => (
              <ControllerCompactCard
                key={x.id}
                controller={x}
                type="positive"
                onViewDetails={openModal}
              />
            ))}
          </div>
        </div>

        <div className="negative border">
          <h3>Negative: <span className="count">({negativeVoters.length})</span></h3>
          <div className="controller-overview">
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Best score</span><span className="stat-value">{negAgg.bestScore}</span></div>
              <div className="stat-item"><span className="stat-label">Worst score</span><span className="stat-value">{negAgg.worstScore}</span></div>
              <div className="stat-item"><span className="stat-label">Average score</span><span className="stat-value">{negAgg.avgScore}</span></div>
            </div>
            <div className="stat-row">
              <div className="stat-item"><span className="stat-label">Fastest</span><span className="stat-value">{negAgg.fastest} s</span></div>
              <div className="stat-item"><span className="stat-label">Slowest</span><span className="stat-value">{negAgg.slowest} s</span></div>
              <div className="stat-item"><span className="stat-label">Average speed</span><span className="stat-value">{negAgg.avgSpeed} s</span></div>
            </div>
          </div>

          <div className="controller-grid">
            {negativeVoters.map(x => (
              <ControllerCompactCard
                key={x.id}
                controller={x}
                type="negative"
                onViewDetails={openModal}
              />
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedController && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Controller {selectedController.id} — Full Details</h2>
              <div>
                <button className="copy-btn" onClick={copyControllerJSON}>📋 JSON</button>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>
            </div>
            <div className="modal-body">
              <FullControllerDetails controller={selectedController} type={selectedType} />
            </div>
          </div>
        </div>
      )}

      {loading && <div className="global-spinner">NeuLegion is syncing with the hive...</div>}
    </div>
  );
};

export default App;