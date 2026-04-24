import React, { useState } from 'react';

function SearchResults({ results, collections, onAddToCollection }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleAddClick = (pinId, imageUrl, collectionId) => {
    onAddToCollection(collectionId, imageUrl, pinId);
    setActiveMenu(null);
  };

  return (
    <div className="search-results">
      {results.map((pin) => (
        <div key={pin.id} className="result-card">
          <img
            src={pin.imageUrl}
            alt="Pinterest result"
            className="result-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="200"%3E%3Crect fill="%23f0f0f0" width="250" height="200"/%3E%3C/svg%3E';
            }}
          />
          <div className="result-actions">
            <div style={{ position: 'relative' }}>
              <button
                className="add-button"
                onClick={() => setActiveMenu(activeMenu === pin.id ? null : pin.id)}
              >
                {collections.length > 0 ? 'Add to collection' : 'Create collection first'}
              </button>
              {activeMenu === pin.id && collections.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {collections.map(col => (
                    <button
                      key={col.id}
                      onClick={() => handleAddClick(pin.id, pin.imageUrl, col.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '0.9rem'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#f9f9f9'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
