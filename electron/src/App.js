import React, { useState } from 'react';
import './App.css';

function App() {
  const [folderPath, setFolderPath] = useState(null);
  const [images, setImages] = useState([]);
  const [splitCount, setSplitCount] = useState({ leah: 10, catalina: 10, isabella: 10 });
  const [higgsFieldUrl, setHiggsFieldUrl] = useState('https://higgsfield.ai');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const characters = [
    { key: 'leah', label: 'Leah', desc: 'Blonde Hair • Asian' },
    { key: 'catalina', label: 'Catalina', desc: 'Black Hair • Latina' },
    { key: 'isabella', label: 'Isabella', desc: 'Black Hair • Asian' }
  ];

  const handleSelectFolder = async () => {
    try {
      const path = await window.electronAPI.selectFolder();
      if (path) {
        setFolderPath(path);
        const fs = require('fs');
        const fsPath = require('path');
        const files = fs.readdirSync(path);
        const imageFiles = files.filter(f =>
          /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
        );
        setImages(imageFiles);
        setProgress(`Found ${imageFiles.length} image(s)`);
      }
    } catch (error) {
      setProgress(`Error selecting folder: ${error.message}`);
    }
  };

  const handleStartUpload = async () => {
    if (!folderPath || images.length === 0) {
      setProgress('Please select a folder with images first');
      return;
    }

    setLoading(true);
    setProgress('Starting automation...');

    try {
      const imagePaths = images.map(img => `${folderPath}/${img}`);

      window.electronAPI.onProgress((msg) => {
        setProgress(msg);
      });

      const result = await window.electronAPI.startUpload({
        imagePaths,
        splitCount,
        higgsFieldUrl
      });

      if (result.success) {
        setProgress('✅ All done! Check Higgsfield for your results.');
      } else {
        setProgress(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setProgress(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalImages = splitCount.leah + splitCount.catalina + splitCount.isabella;
  const imagesReady = images.length >= totalImages;

  return (
    <div className="App">
      <div className="App-container">
        {/* Header */}
        <div className="header">
          <h1>Picture Scrapper</h1>
          <p>Automate Higgsfield generations across your characters</p>
        </div>

        {/* Step 1: Select Folder */}
        <section className="card">
          <div className="step-header">
            <div className="step-number">1</div>
            <div>
              <h3>Select your images</h3>
              <p className="step-desc">Choose a folder with reference photos</p>
            </div>
          </div>

          {!folderPath ? (
            <button className="btn-primary" onClick={handleSelectFolder} disabled={loading}>
              Open Folder
            </button>
          ) : (
            <div className="folder-info">
              <div className="folder-path">
                <span className="folder-icon">📁</span>
                <div>
                  <p className="path">{folderPath.split('/').pop()}</p>
                  <p className="count">{images.length} images</p>
                </div>
              </div>
              <button className="btn-secondary" onClick={handleSelectFolder} disabled={loading}>
                Change
              </button>
            </div>
          )}
        </section>

        {/* Step 2: Configure Split */}
        {folderPath && (
          <section className="card">
            <div className="step-header">
              <div className="step-number">2</div>
              <div>
                <h3>Distribute to characters</h3>
                <p className="step-desc">How many images per character</p>
              </div>
            </div>

            <div className="split-grid">
              {characters.map(char => (
                <div key={char.key} className="split-item">
                  <label>{char.label}</label>
                  <p className="char-desc">{char.desc}</p>
                  <div className="split-input-group">
                    <button onClick={() => setSplitCount(s => ({ ...s, [char.key]: Math.max(0, s[char.key] - 1) }))} disabled={loading}>−</button>
                    <input
                      type="number"
                      value={splitCount[char.key]}
                      onChange={(e) => setSplitCount(s => ({ ...s, [char.key]: Math.max(0, parseInt(e.target.value) || 0) }))}
                      disabled={loading}
                    />
                    <button onClick={() => setSplitCount(s => ({ ...s, [char.key]: s[char.key] + 1 }))} disabled={loading}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="split-summary">
              <p>Total: <strong>{totalImages}</strong> generations from <strong>{images.length}</strong> images</p>
              {!imagesReady && totalImages > images.length && (
                <p className="warning">⚠️ You need {totalImages - images.length} more images</p>
              )}
            </div>
          </section>
        )}

        {/* Step 3: Advanced Settings */}
        {folderPath && (
          <section className="card">
            <button className="btn-link" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? '▼' : '▶'} Advanced Settings
            </button>

            {showAdvanced && (
              <div className="advanced-section">
                <label>Higgsfield URL</label>
                <input
                  type="text"
                  placeholder="https://higgsfield.ai"
                  value={higgsFieldUrl}
                  onChange={(e) => setHiggsFieldUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
          </section>
        )}

        {/* Start Button */}
        {folderPath && (
          <button
            className="btn-primary btn-large"
            onClick={handleStartUpload}
            disabled={loading || !imagesReady}
          >
            {loading ? '⏳ Processing...' : '🚀 Start Generation'}
          </button>
        )}

        {/* Progress */}
        {progress && (
          <section className="card progress-card">
            <div className="progress-content">
              {progress}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
