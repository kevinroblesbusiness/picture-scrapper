import React, { useState } from 'react';
import './App.css';

function App() {
  const [folderPath, setFolderPath] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('leah');
  const [higgsFieldUrl, setHiggsFieldUrl] = useState('https://higgsfield.ai');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const characters = ['Leah', 'Catalina', 'Isabella'];

  const handleSelectFolder = async () => {
    try {
      const path = await window.electronAPI.selectFolder();
      if (path) {
        setFolderPath(path);
        // Get images from folder
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
    setProgress('Starting upload automation...');

    try {
      const imagePaths = images.map(img => `${folderPath}/${img}`);

      window.electronAPI.onProgress((msg) => {
        setProgress(msg);
      });

      const result = await window.electronAPI.startUpload({
        imagePaths,
        character: selectedCharacter,
        higgsFieldUrl
      });

      if (result.success) {
        setProgress('✅ Upload completed successfully!');
      } else {
        setProgress(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setProgress(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Picture Scrapper Automation</h1>
        <p>Auto-upload reference images to Higgsfield</p>
      </header>

      <div className="App-container">
        <section className="section">
          <h2>1. Select Folder</h2>
          <button className="primary-btn" onClick={handleSelectFolder} disabled={loading}>
            📁 Choose Folder from Desktop
          </button>
          {folderPath && (
            <div className="info-box">
              <p><strong>Selected:</strong> {folderPath}</p>
              <p><strong>Images found:</strong> {images.length}</p>
              {images.length > 0 && (
                <div className="image-list">
                  {images.map((img, i) => (
                    <small key={i}>✓ {img}</small>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="section">
          <h2>2. Select Character</h2>
          <div className="character-select">
            {characters.map(char => (
              <button
                key={char}
                className={`char-btn ${selectedCharacter.toLowerCase() === char.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCharacter(char.toLowerCase())}
                disabled={loading}
              >
                👤 {char}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>3. Higgsfield URL</h2>
          <input
            type="text"
            placeholder="https://higgsfield.ai"
            value={higgsFieldUrl}
            onChange={(e) => setHiggsFieldUrl(e.target.value)}
            disabled={loading}
            className="url-input"
          />
        </section>

        <section className="section">
          <button
            className="upload-btn"
            onClick={handleStartUpload}
            disabled={loading || !folderPath || images.length === 0}
          >
            {loading ? '⏳ Running...' : '🚀 Start Upload & Generate'}
          </button>
        </section>

        {progress && (
          <section className="section progress-section">
            <h3>Status</h3>
            <div className="progress-box">
              {progress}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
