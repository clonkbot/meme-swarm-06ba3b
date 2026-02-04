import { useState, useEffect, useCallback } from 'react';
import './styles.css';

interface Agent {
  id: string;
  name: string;
  status: 'scanning' | 'found' | 'deploying' | 'deployed';
  target: string;
  platform: string;
  progress: number;
  memeFound?: MemeData;
}

interface MemeData {
  name: string;
  ticker: string;
  virality: number;
  source: string;
  sentiment: number;
}

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'alert' | 'deploy';
  message: string;
}

const PLATFORMS = ['Twitter/X', 'Reddit', 'TikTok', '4chan', 'Discord', 'Telegram'];
const MEME_NAMES = ['PEPE 2.0', 'WOJAK INU', 'GIGACHAD', 'BONKFATHER', 'DOGELON X', 'SHIBA SUPREME', 'FROG KING', 'APU TOKEN', 'MOCHI CAT', 'BASED BEAR'];
const TICKERS = ['$PEPE2', '$WJAK', '$GIGA', '$BONKF', '$DGEX', '$SHIB2', '$FRGK', '$APU', '$MOCHI', '$BBEAR'];
const AGENT_NAMES = ['CRAWLER-01', 'SENTINEL-X', 'HUNTER-7B', 'SCOUT-PRIME', 'SEEKER-ND', 'ORACLE-V9'];

function generateAgent(index: number): Agent {
  return {
    id: `agent-${Date.now()}-${index}`,
    name: AGENT_NAMES[index % AGENT_NAMES.length],
    status: 'scanning',
    target: 'meme trends',
    platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
    progress: Math.random() * 30,
  };
}

function generateMeme(): MemeData {
  const idx = Math.floor(Math.random() * MEME_NAMES.length);
  return {
    name: MEME_NAMES[idx],
    ticker: TICKERS[idx],
    virality: Math.floor(Math.random() * 40) + 60,
    source: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
    sentiment: Math.floor(Math.random() * 30) + 70,
  };
}

function RadarScan() {
  return (
    <div className="radar-container">
      <div className="radar">
        <div className="radar-sweep" />
        <div className="radar-grid" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="radar-dot"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div className="radar-label">SWARM RADAR</div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusColors = {
    scanning: '#00ffff',
    found: '#ffff00',
    deploying: '#ff6600',
    deployed: '#00ff00',
  };

  return (
    <div className={`agent-card ${agent.status}`}>
      <div className="agent-header">
        <span className="agent-name">{agent.name}</span>
        <span
          className="agent-status"
          style={{ color: statusColors[agent.status] }}
        >
          {agent.status.toUpperCase()}
        </span>
      </div>
      <div className="agent-platform">
        <span className="label">PLATFORM:</span> {agent.platform}
      </div>
      <div className="agent-progress-bar">
        <div
          className="agent-progress-fill"
          style={{
            width: `${agent.progress}%`,
            backgroundColor: statusColors[agent.status],
          }}
        />
      </div>
      {agent.memeFound && (
        <div className="agent-meme-found">
          <div className="meme-ticker">{agent.memeFound.ticker}</div>
          <div className="meme-stats">
            <span>VIRAL: {agent.memeFound.virality}%</span>
            <span>SENT: {agent.memeFound.sentiment}%</span>
          </div>
        </div>
      )}
      <div className="scan-line" />
    </div>
  );
}

function TerminalLog({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">SWARM_LOG.exe</span>
      </div>
      <div className="terminal-body">
        {logs.map((log, i) => (
          <div key={i} className={`log-entry ${log.type}`}>
            <span className="log-time">[{log.timestamp}]</span>
            <span className="log-msg">{log.message}</span>
          </div>
        ))}
        <div className="cursor-blink">_</div>
      </div>
    </div>
  );
}

function TokenDeployed({ meme }: { meme: MemeData }) {
  return (
    <div className="deployed-token">
      <div className="token-glow" />
      <div className="token-ticker">{meme.ticker}</div>
      <div className="token-name">{meme.name}</div>
      <div className="token-chain">DEPLOYED ON BASE</div>
      <div className="token-stats">
        <div className="stat">
          <span className="stat-label">VIRALITY</span>
          <span className="stat-value">{meme.virality}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">SENTIMENT</span>
          <span className="stat-value">{meme.sentiment}%</span>
        </div>
      </div>
    </div>
  );
}

function StatsPanel({ agents, deployedCount }: { agents: Agent[]; deployedCount: number }) {
  const scanning = agents.filter((a) => a.status === 'scanning').length;
  const found = agents.filter((a) => a.status === 'found').length;
  const deploying = agents.filter((a) => a.status === 'deploying').length;

  return (
    <div className="stats-panel">
      <div className="stat-box">
        <div className="stat-number cyan">{agents.length}</div>
        <div className="stat-label">ACTIVE AGENTS</div>
      </div>
      <div className="stat-box">
        <div className="stat-number yellow">{scanning}</div>
        <div className="stat-label">SCANNING</div>
      </div>
      <div className="stat-box">
        <div className="stat-number orange">{found + deploying}</div>
        <div className="stat-label">TARGETS LOCKED</div>
      </div>
      <div className="stat-box">
        <div className="stat-number green">{deployedCount}</div>
        <div className="stat-label">TOKENS DEPLOYED</div>
      </div>
    </div>
  );
}

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(() =>
    Array.from({ length: 6 }, (_, i) => generateAgent(i))
  );
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '00:00:00', type: 'info', message: 'MEME SWARM INITIALIZED...' },
    { timestamp: '00:00:01', type: 'info', message: 'CONNECTING TO BASE NETWORK...' },
    { timestamp: '00:00:02', type: 'success', message: 'AGENTS DEPLOYED. SCANNING INITIATED.' },
  ]);
  const [deployedTokens, setDeployedTokens] = useState<MemeData[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs((prev) => [...prev.slice(-50), { timestamp, type, message }]);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          let newAgent = { ...agent };
          newAgent.progress = Math.min(100, agent.progress + Math.random() * 15);

          if (agent.status === 'scanning' && newAgent.progress > 70 && Math.random() > 0.7) {
            newAgent.status = 'found';
            newAgent.memeFound = generateMeme();
            addLog('alert', `${agent.name}: MEME DETECTED - ${newAgent.memeFound.ticker} on ${newAgent.memeFound.source}`);
          } else if (agent.status === 'found' && Math.random() > 0.6) {
            newAgent.status = 'deploying';
            addLog('info', `${agent.name}: INITIATING TOKEN DEPLOYMENT FOR ${agent.memeFound?.ticker}...`);
          } else if (agent.status === 'deploying' && newAgent.progress > 95) {
            newAgent.status = 'deployed';
            if (agent.memeFound) {
              setDeployedTokens((prev) => [...prev.slice(-5), agent.memeFound as MemeData]);
              addLog('deploy', `${agent.name}: ${agent.memeFound.ticker} DEPLOYED ON BASE - CONTRACT LIVE`);
            }
            setTimeout(() => {
              setAgents((currentAgents) =>
                currentAgents.map((a) =>
                  a.id === agent.id
                    ? {
                        ...generateAgent(0),
                        id: agent.id,
                        name: agent.name,
                      }
                    : a
                )
              );
            }, 2000);
          }

          return newAgent;
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, addLog]);

  return (
    <div className="app">
      <div className="crt-overlay" />
      <div className="noise-overlay" />

      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#00ffff" strokeWidth="2" />
              <circle cx="20" cy="20" r="10" stroke="#00ffff" strokeWidth="1" />
              <circle cx="20" cy="20" r="3" fill="#00ffff" />
              <line x1="20" y1="2" x2="20" y2="10" stroke="#00ffff" strokeWidth="2" />
              <line x1="20" y1="30" x2="20" y2="38" stroke="#00ffff" strokeWidth="2" />
              <line x1="2" y1="20" x2="10" y2="20" stroke="#00ffff" strokeWidth="2" />
              <line x1="30" y1="20" x2="38" y2="20" stroke="#00ffff" strokeWidth="2" />
            </svg>
          </div>
          <div className="logo-text">
            <h1>MEME SWARM</h1>
            <span className="logo-subtitle">AUTONOMOUS TOKEN DEPLOYER</span>
          </div>
        </div>
        <div className="header-status">
          <span className={`status-indicator ${isRunning ? 'active' : ''}`} />
          <span>{isRunning ? 'SWARM ACTIVE' : 'SWARM PAUSED'}</span>
          <button
            className="control-btn"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'PAUSE' : 'RESUME'}
          </button>
        </div>
      </header>

      <main className="main">
        <div className="left-panel">
          <RadarScan />
          <StatsPanel agents={agents} deployedCount={deployedTokens.length} />
        </div>

        <div className="center-panel">
          <h2 className="section-title">AGENT SWARM STATUS</h2>
          <div className="agents-grid">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        <div className="right-panel">
          <TerminalLog logs={logs} />
          {deployedTokens.length > 0 && (
            <div className="deployed-section">
              <h3 className="section-title">RECENTLY DEPLOYED</h3>
              <div className="deployed-list">
                {deployedTokens.slice(-3).map((token, i) => (
                  <TokenDeployed key={i} meme={token} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>Requested by @plantingtoearn · Built by @clonkbot</span>
      </footer>
    </div>
  );
}
