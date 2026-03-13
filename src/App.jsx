import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css';

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
          <span className="stat-label">Confidence</span>
          <span className={`stat-value ${probColor}`}>{controller.stats.probability} %</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Influence</span>
          <span className="stat-value">{controller.influence} %</span>
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

const FullControllerDetails = ({ controller }) => {
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
            <div className="stat-item"><span className="stat-label">Min / Max move %</span><span className="stat-value">{controller.params.minMove} / {controller.params.maxMove} %</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Candles used</span><span className="stat-value">{controller.params.candlesUsed}</span></div>
            <div className="stat-item"><span className="stat-label">Indicators used</span><span className="stat-value">{controller.params.indicatorsUsed}</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Atr factor</span><span className="stat-value">{controller.params.atrFactor}×</span></div>
            <div className="stat-item"><span className="stat-label">Stop factor</span><span className="stat-value">{controller.params.stopFactor}×</span></div>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h4 className="section-title">Current Position</h4>
        <div className="stat-group">
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Entry price</span><span className="stat-value">{controller.price.entryPrice}</span></div>
            <div className="stat-item"></div>
          </div>
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Exit price</span>
              <span className="stat-value">{controller.price.exitPrice} ( +{controller.price.profitPct} % )</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Stop loss</span>
              <span className="stat-value">{controller.price.stopLoss} ( -{controller.price.stopLossPct} % )</span>
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
            <div className="stat-item">
              <span className="stat-label">Accuracy score</span>
              <span className="stat-value">{controller.stats.lifetimeMinScore} &lt; {controller.stats.accuracyScore} &gt; {controller.stats.lifetimeMaxScore}</span>
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
        <h4 className="section-title">Memory</h4>
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

const CandleChart = ({ 
  candles = [], 
  entryPrice, 
  exitPrice, 
  stopLoss,
  direction = '',
  enlarged = false
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const containerWidth = container.clientWidth - (enlarged ? 80 : 48);
    const displayWidth = enlarged 
      ? Math.min(containerWidth, 1280) 
      : Math.max(520, Math.min(containerWidth, 1180));
    const displayHeight = Math.floor(displayWidth * (enlarged ? 0.48 : 0.42));

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    if (candles.length < 2) {
      ctx.fillStyle = '#666';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for candle data...', displayWidth/2, displayHeight/2);
      return;
    }

    let minPrice = Infinity, maxPrice = -Infinity, maxVolume = 0;
    candles.forEach(c => {
      minPrice = Math.min(minPrice, c.low);
      maxPrice = Math.max(maxPrice, c.high);
      maxVolume = Math.max(maxVolume, c.volume || 0);
    });
    [entryPrice, exitPrice, stopLoss].forEach(p => {
      if (typeof p === 'number' && !isNaN(p)) {
        minPrice = Math.min(minPrice, p);
        maxPrice = Math.max(maxPrice, p);
      }
    });

    const priceRange = maxPrice - minPrice || 1;
    const padding = priceRange * 0.09;
    minPrice -= padding;
    maxPrice += padding;

    const paddingLeft = 78;
    const paddingRight = 68;
    const paddingTop = 42;
    const paddingBottom = 30;
    const mainChartHeight = displayHeight - paddingTop - paddingBottom;
    const volumeHeight = Math.floor(mainChartHeight * 0.22);

    const chartHeight = mainChartHeight - volumeHeight;
    const volumeYStart = paddingTop + chartHeight + 12;

    const candleCount = candles.length;
    const slotWidth = (displayWidth - paddingLeft - paddingRight) / candleCount;
    const bodyWidth = Math.max(5.5, Math.floor(slotWidth * 0.56));

    const getY = (price) => paddingTop + ((maxPrice - price) / priceRange) * chartHeight;

    ctx.strokeStyle = '#1f1f1f';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    for (let i = 0; i <= 6; i++) {
      const y = paddingTop + (i / 6) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(paddingLeft - 12, y);
      ctx.lineTo(displayWidth - paddingRight + 16, y);
      ctx.stroke();

      const priceVal = maxPrice - (i / 6) * priceRange;
      ctx.fillStyle = '#555';
      ctx.font = '10.5px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(priceVal.toFixed(5), paddingLeft - 18, y + 3.5);
    }
    ctx.setLineDash([]);

    candles.forEach((candle, i) => {
      const x = paddingLeft + i * slotWidth + slotWidth / 2;
      const highY = getY(candle.high);
      const lowY = getY(candle.low);
      const openY = getY(candle.open);
      const closeY = getY(candle.close);

      const isBullish = candle.close >= candle.open;
      const color = isBullish ? '#22c55e' : '#ef4444';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const top = Math.min(openY, closeY);
      const height = Math.max(Math.abs(closeY - openY), 2);
      ctx.fillStyle = color;
      ctx.fillRect(x - bodyWidth/2, top, bodyWidth, height);
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x - bodyWidth/2, top, bodyWidth, height);
    });

    const volMax = maxVolume || 1;
    const volSlot = slotWidth * 0.7;
    candles.forEach((candle, i) => {
      const x = paddingLeft + i * slotWidth + slotWidth / 2 - volSlot / 2;
      const volHeightPx = (candle.volume || 0) / volMax * volumeHeight * 0.92;
      const y = volumeYStart + volumeHeight - volHeightPx;
      ctx.fillStyle = '#ffffff22';
      ctx.fillRect(x, y, volSlot, volHeightPx);
    });

    const levelDefs = [
      { price: entryPrice, color: '#ffaa33', dash: [3, 2] },
      { price: exitPrice,  color: '#22c55e', dash: [5, 3] },
      { price: stopLoss,   color: '#ef4444', dash: [3, 3] }
    ];

    levelDefs.forEach(({ price, color, dash }) => {
      if (!price || typeof price !== 'number' || isNaN(price)) return;
      const y = getY(price);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.25;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(paddingLeft - 12, y);
      ctx.lineTo(displayWidth - paddingRight + 12, y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    ctx.fillStyle = '#666';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(candleCount / 8));
    candles.forEach((c, i) => {
      if (i % step === 0 || i === candleCount - 1) {
        const xPos = paddingLeft + i * slotWidth + slotWidth / 2;
        ctx.fillText(c.id ? `#${11 - (i + 1)}` : (i+1).toString(), xPos, displayHeight - 12);
      }
    });

  }, [candles, entryPrice, exitPrice, stopLoss, direction, enlarged]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => drawChart());
    observer.observe(container);
    drawChart();
    return () => observer.disconnect();
  }, [drawChart]);

  return (
    <div ref={containerRef} className={`candle-chart-container ${enlarged ? 'enlarged' : ''}`}>
      <canvas ref={canvasRef} className="candle-canvas" />
    </div>
  );
};

const App = () => {
  const [legionState, setLegionState] = useState({
    consensus: {},
    controllers: {},
    memoryVaultStats: {},
    overview: {},
    lastCandles : []
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
  const [showChartModal, setShowChartModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000');
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
          Controllers: <span className='stat-value'>{legionState.controllers?.positive?.voters?.length + legionState.controllers?.negative?.voters?.length}</span> • 
          Last updated: <span className='stat-value'>{lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}</span>
        </p>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error} 
          <button onClick={fetchData}>RETRY</button>
        </div>
      )}

      <div className="overview-section">
        <div className='border'>
          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value">{legionState.overview.status || '—'}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Candle</span>
              <span className="stat-value">{legionState.overview.candleCounter || 0}</span>
            </div>
          </div>

          <div className='stat-row'>
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

        <div className='border'>
          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Direction</span>
              <span className='stat-value'>
                {legionState.consensus.direction || '—'} ( {legionState.consensus.confidence || 0} % )
              </span>
            </div>

            <div className="stat-item"><span className="stat-label">Entry</span><span className="stat-value">{legionState.consensus.entryPrice || '—'}</span></div>
          </div>

          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Exit</span>
              <span className="stat-value">{legionState.consensus.exitPrice || '—'} ( +{legionState.consensus.profitPct || 0} % )</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Stop Loss</span>
              <span className="stat-value">{legionState.consensus.stopLoss || '—'} ( -{legionState.consensus.stopLossPct || 0} % )</span>
            </div>
          </div>
        </div>

        <div className='border'>
          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Open simulations</span>
              <span className="stat-value">{legionState.consensus.record?.openSimulations || 0}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Final Accuracy Score</span>
              <span className="stat-value">{legionState.consensus.record?.finalAccuracyScore || 0}</span>
            </div>
          </div>

          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Buy Accuracy Score</span>
              <span className="stat-value">{legionState.consensus.record?.buyAccuracyScore || 0}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Sell Accuracy Score</span>
              <span className="stat-value">{legionState.consensus.record?.sellAccuracyScore || 0}</span>
            </div>
          </div>

          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Buy Trade Accuracy</span>
              <span className="stat-value">{legionState.consensus.record?.buyTradeAccuracy || 0} %</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Sell Trade Accuracy</span>
              <span className="stat-value">{legionState.consensus.record?.sellTradeAccuracy || 0} %</span>
            </div>
          </div>

          <div className='stat-row'>
            <div className="stat-item">
              <span className="stat-label">Buy Confidence Accuracy</span>
              <span className="stat-value">{legionState.consensus.record?.buyConfidenceAccuracy || 0} %</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Sell Confidence Accuracy</span>
              <span className="stat-value">{legionState.consensus.record?.sellConfidenceAccuracy || 0} %</span>
            </div>
          </div>
        </div>

        <div className='border'>
          <div className='stat-row'>
            <div className="stat-item"><span className="stat-label">Total vault memories</span><span className="stat-value">{legionState.memoryVaultStats.totalVaultMemories || 0}</span></div>

            <div className='stat-item'>
              <span className='stat-label'>Vault Fill</span>
              <span className='stat-value'>{legionState.memoryVaultStats.vaultFillPercentage || 0} %</span>
            </div>
          </div>

          <div className='stat-row'>
            <div className="stat-item"><span className="stat-label">Positive volatile</span><span className="stat-value">{legionState.memoryVaultStats.volatilePos || 0}</span></div>
            <div className="stat-item"><span className="stat-label">Positive core</span><span className="stat-value">{legionState.memoryVaultStats.corePos || 0}</span></div>
          </div>

          <div className='stat-row'>
            <div className="stat-item"><span className="stat-label">Negative volatile</span><span className="stat-value">{legionState.memoryVaultStats.volatileNeg || 0}</span></div>
            <div className="stat-item"><span className="stat-label">Negative core</span><span className="stat-value">{legionState.memoryVaultStats.coreNeg || 0}</span></div>
          </div>

          <div className='stat-row'>
            <div className="stat-item"><span className="stat-label">Total volatile</span><span className="stat-value">{legionState.memoryVaultStats.totalVolatile || 0}</span></div>
            <div className="stat-item"><span className="stat-label">Total core</span><span className="stat-value">{legionState.memoryVaultStats.totalCore || 0}</span></div>
          </div>
        </div>
      </div>

      <div className='border candle-section'>
        <CandleChart 
          candles={legionState.lastCandles || []}
          entryPrice={legionState.consensus?.entryPrice}
          exitPrice={legionState.consensus?.exitPrice}
          stopLoss={legionState.consensus?.stopLoss}
          direction={legionState.consensus?.direction}
        />
        
        <button 
          className="enlarge-chart-btn"
          onClick={() => setShowChartModal(true)}
        >
          🔎 View Enlarged Chart
        </button>
      </div>

      {showChartModal && (
        <div className="modal-overlay" onClick={() => setShowChartModal(false)}>
          <div className="modal enlarged-chart-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>NeuLegion — Full Candle View</h2>
              <button className="close-btn" onClick={() => setShowChartModal(false)}>×</button>
            </div>
            <div className="modal-body enlarged">
              <CandleChart 
                candles={legionState.lastCandles || []}
                entryPrice={legionState.consensus?.entryPrice}
                exitPrice={legionState.consensus?.exitPrice}
                stopLoss={legionState.consensus?.stopLoss}
                direction={legionState.consensus?.direction}
                enlarged={true}
              />
            </div>
          </div>
        </div>
      )}

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
          <option value="probability">Sort: Confidence ↓</option>
          <option value="influence">Sort: Influence ↓</option>
          <option value="speed">Sort: Speed ↑</option>
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