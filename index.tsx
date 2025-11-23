import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch crashes and avoid "Black Screen of Death"
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    // Normalize error to an Error object if it isn't one
    const err = error instanceof Error ? error : new Error(String(error));
    return { hasError: true, error: err };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#0f172a', 
          color: '#ef4444', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ System Crash</h1>
          <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', maxWidth: '800px', width: '100%', overflowX: 'auto', border: '1px solid #334155' }}>
            <p style={{ margin: 0, color: '#f87171' }}>{this.state.error?.message || "Unknown Error"}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);