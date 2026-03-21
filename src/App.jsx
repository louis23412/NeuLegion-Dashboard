import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css';

import mainLogo from './assets/main-logo.png';
import accuracy from './assets/accuracy.png';
import chart from './assets/chart.png';
import influence from './assets/influence.png';
import pop from './assets/pop.png';
import pulse from './assets/pulse.png';
import chartUp from './assets/up.png';
import chartDown from './assets/down.png';

const ControllerCompactCard = ({ controller, type, onViewDetails, selected }) => {
  const isPositive = type === 'positive';

  return (
    <div 
      className={`controller-compact ${isPositive ? 'green-controller' : 'red-controller'}`}
      onClick={() => onViewDetails(controller, type)}
    >
      <div className="center">
        <h6 className="id">
          {controller.id}
        </h6>
      </div>

      <div className="key-metrics">

        <div className={`center ${selected === 'population' ? 'selected-sort' : ''}`}>
          <div className='column'>
            <img src={pop} alt="pop" className='compact-icon'/>
            <span className="stat-value">{controller.params.population}</span>
          </div>
        </div>

        <div className={`center ${selected === 'accuracy' ? 'selected-sort' : ''}`}>
          <div className='column'>
            <img src={accuracy} alt="accuracy" className='compact-icon' />
            <span className="stat-value">{(controller.stats.accuracyScore).toFixed(2)}%</span>
          </div>
        </div>

        <div className={`center ${selected === 'confidence' ? 'selected-sort' : ''}`}>
          <div className='column'>
            <img src={chart} alt="chart" className='compact-icon'/>
            <span className="stat-value">{(controller.stats.probability).toFixed(2)}%</span>
          </div>
        </div>
        
        <div className={`center ${selected === 'influence' ? 'selected-sort' : ''}`}>
          <div className='column'>
            <img src={influence} alt="influence" className='compact-icon'/>
            <span className="stat-value">{(controller.influence).toFixed(2)}%</span>
          </div>
        </div>

        <div className={"center"}>
          <div className={`column ${selected === 'speed' ? 'selected-sort' : ''}`}>
            <img src={pulse} alt="pulse" className='compact-icon'/>
            <span className="stat-value">{(controller.signalSpeed).toFixed(2)}s</span>
          </div>
        </div>

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
          </div>
          <div className="stat-row">
            <div className="stat-item"><span className="stat-label">Confidence</span><span className="stat-value">{controller.stats.probability} %</span></div>
            <div className="stat-item"><span className="stat-label">Accuracy</span><span className="stat-value">{controller.stats.accuracyScore} %</span></div>
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
      ctx.fillText(priceVal.toFixed(4), paddingLeft - 18, y + 3.5);
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

  }, [candles, entryPrice, exitPrice, stopLoss, enlarged]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => drawChart());
    observer.observe(container);
    drawChart();
    return () => observer.disconnect();
  }, [drawChart]);

  return (
    <div ref={containerRef} className={'candle-chart-container'}>
      <canvas ref={canvasRef} className="candle-canvas" />
    </div>
  );
};

const ScoreHistoryChart = ({ 
  scoreHistories = [], 
  enlarged = false 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

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

    if (scoreHistories.length < 2) {
      ctx.fillStyle = '#666';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        scoreHistories.length === 0 ? 'Waiting for score history data...' : 'Insufficient data',
        displayWidth / 2, 
        displayHeight / 2
      );
      return;
    }

    const minScore = 0;
    const maxScore = 100;
    const scoreRange = maxScore - minScore;

    const paddingLeft = 78;
    const paddingRight = 68;
    const paddingTop = 42;
    const paddingBottom = 30;
    const chartHeight = displayHeight - paddingTop - paddingBottom;

    const getY = (score) => paddingTop + ((maxScore - score) / scoreRange) * chartHeight;

    ctx.strokeStyle = '#1f1f1f';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    for (let i = 0; i <= 5; i++) {
      const y = paddingTop + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(paddingLeft - 12, y);
      ctx.lineTo(displayWidth - paddingRight + 16, y);
      ctx.stroke();

      const scoreVal = maxScore - (i / 5) * scoreRange;
      ctx.fillStyle = '#555';
      ctx.font = '10.5px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(scoreVal.toFixed(0), paddingLeft - 18, y + 3.5);
    }
    ctx.setLineDash([]);

    const colors = {
      buyScore: '#22c55e',
      sellScore: '#ef4444',
      finalScore: '#ffaa33'
    };

    const lineWidth = 1;

    const historyLength = scoreHistories.length;
    const slotWidth = (displayWidth - paddingLeft - paddingRight) / (historyLength - 1 || 1);

    const scoreKeys = ['buyScore', 'sellScore', 'finalScore'];

    scoreKeys.forEach(key => {
      ctx.strokeStyle = colors[key];
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      let first = true;

      scoreHistories.forEach((entry, i) => {
        const x = paddingLeft + i * slotWidth;
        const y = getY(entry[key] || 0);

        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });

  }, [scoreHistories, enlarged]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => drawChart());
    observer.observe(container);
    drawChart();
    return () => observer.disconnect();
  }, [drawChart]);

  return (
    <div ref={containerRef} className={`candle-chart-container`}>
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
  const [showModal, setShowModal] = useState(false);
  const [selectedController, setSelectedController] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('accuracy');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const ipAddress = import.meta.env.localIp;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://${ipAddress}:3000`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      setLegionState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedController(null);
  };

  const openModal = (controller) => {
    setSelectedController(controller);
    setShowModal(true);
  };

  const getComparator = (option) => (a, b) => {
    if (option === 'population') return b.params.population - a.params.population;
    if (option === 'accuracy') return b.stats.accuracyScore - a.stats.accuracyScore;
    if (option === 'confidence') return b.stats.probability - a.stats.probability;
    if (option === 'influence') return b.influence - a.influence;
    if (option === 'speed') return a.signalSpeed - b.signalSpeed;
  };

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

  const positiveVoters = useMemo(() => {
    const voters = legionState.controllers?.positive?.voters || [];
    return voters.filter(v =>
      v.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [legionState, searchTerm]);

  const negativeVoters = useMemo(() => {
    const voters = legionState.controllers?.negative?.voters || [];
    return voters.filter(v =>
      v.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [legionState, searchTerm]);

  const sortedVoters = useMemo(() => {
    const combined = [
      ...positiveVoters.map(c => ({ ...c, type: 'positive' })),
      ...negativeVoters.map(c => ({ ...c, type: 'negative' }))
    ];
    return combined.sort(getComparator(sortOption));
  }, [positiveVoters, negativeVoters, sortOption]);

  return (
    <div className="main">
      <div className="premium-header">
        <div className="header-top">
          <div className='logo-and-name'>
            <img src={mainLogo} alt="main logo" className='main-logo'/>

            <div>
              <h1 className='main-text'>Neu<span className='orange'>Legion</span></h1>
              <div className='spread'>
                <span>Population: <span className='orange'>{legionState.overview.population || 0}</span></span>
                <span>Controllers: <span className='orange'>{(legionState.controllers?.positive?.voters?.length || 0) + (legionState.controllers?.negative?.voters?.length || 0)}</span></span>
              </div>
            </div>
          </div>

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
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error} 
          <button onClick={fetchData}>RETRY</button>
        </div>
      )}

      <div className='border spread chart-block status-block'>
        <span>Status: <span className='orange'>{legionState.overview?.status || '-'}</span></span>
        <span>Candle: #<span className='orange'>{legionState.overview?.candleCounter || '-'}</span></span>
        <span>Update time: <span className='orange'>{legionState.overview?.updateTime || '-'}</span>s</span>
        <span>Runtime: <span className='orange'>{legionState.overview?.runtimeSeconds || '-'}</span>s</span>
      </div>

      <div className='border'>
        <div className='center consensus-answer'>
          <span className='spread'>
            Consensus: 
            <img src={legionState.consensus?.direction === 'BUY' ? chartUp : chartDown} alt="direction" />
            <span className={`${legionState.consensus?.direction === 'BUY' ? 'green' : 'red'}`}> {legionState.consensus?.direction || '—'} </span>
          </span>

          <span className='spread'>Confidence: <span className='orange'>{legionState.consensus?.confidence || '—'}</span> %</span>
        </div>

        <div className='chart-section'>
          <div className='chart-block'>
            <CandleChart 
              candles={legionState.lastCandles || []}
              entryPrice={legionState.consensus?.entryPrice}
              exitPrice={legionState.consensus?.exitPrice}
              stopLoss={legionState.consensus?.stopLoss}
            />

            <div className='center spread'>
              <span>Entry: <span className='orange'>{legionState.consensus?.entryPrice || '—'}</span></span>
              <span>
                Exit: 
                <span className='orange'> {legionState.consensus?.exitPrice || '—'} </span> 
                ( <span className='orange'>{legionState.consensus?.profitPct || '—'}</span>% )
              </span>
              <span>
                Stop Loss: 
                <span className='orange'> {legionState.consensus?.stopLoss || '—'} </span> 
                ( <span className='orange'>{legionState.consensus?.stopLossPct || '—'}</span>% )
              </span>
            </div>
          </div>

          <div className='chart-block'>
            <ScoreHistoryChart 
              scoreHistories={legionState.consensus?.record?.scoreHistories || []}
            />

            <div className='center spread'>
              <span>
                Buy:
                <span className='orange'> {legionState.consensus?.record?.minBuyAccuracyScore || 0} </span>
                {'<'}
                <span className='orange'> {legionState.consensus?.record?.buyAccuracyScore || 0} </span>
                {'>'}
                <span className='orange'> {legionState.consensus?.record?.maxBuyAccuracyScore || 0}</span>
              </span>

              <span>
                Sell:
                <span className='orange'> {legionState.consensus?.record?.minSellAccuracyScore  || 0} </span>
                {'<'}
                <span className='orange'> {legionState.consensus?.record?.sellAccuracyScore || 0} </span>
                {'>'}
                <span className='orange'> {legionState.consensus?.record?.maxSellAccuracyScore || 0}</span>
              </span>

              <span>
                Final:
                <span className='orange'> {legionState.consensus?.record?.minFinalAccuracy || 0} </span>
                {'<'}
                <span className='orange'> {legionState.consensus?.record?.finalAccuracyScore || 0} </span>
                {'>'}
                <span className='orange'> {legionState.consensus?.record?.maxFinalAccuracy || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="controllers">
        <div className="border">
          <div className="controllers-controls">
            <input
              type="text"
              placeholder="Search by controller ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="sort-select">
              <option value="population">Sort: Population ↓</option>
              <option value="accuracy">Sort: Accuracy Score ↓</option>
              <option value="confidence">Sort: Confidence ↓</option>
              <option value="influence">Sort: Influence ↓</option>
              <option value="speed">Sort: Speed ↑</option>
            </select>
          </div>

          <div className='controller-grid'>
            {sortedVoters.map((controller) => (
              <ControllerCompactCard
                key={controller.id}
                controller={controller}
                type={controller.type}
                onViewDetails={openModal}
                selected={sortOption}
              />
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedController && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedController.id}</h2>
              <button className="close-btn pull-right" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <FullControllerDetails controller={selectedController} />
            </div>
          </div>
        </div>
      )}

      {loading && <div>NeuLegion is syncing...</div>}
    </div>
  );
};

export default App;