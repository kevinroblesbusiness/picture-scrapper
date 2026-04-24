import React from 'react';

function CollectionDetail({ collection, onBack }) {
  const handleExport = () => {
    const dataStr = JSON.stringify(collection, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${collection.name}-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="collection-detail">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{collection.name}</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={handleExport}
          style={{
            padding: '0.5rem 1rem',
            background: '#e60023',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export as JSON
        </button>
      </div>

      {collection.images.length === 0 ? (
        <div className="empty-message">No images in this collection yet.</div>
      ) : (
        <>
          <p style={{ color: '#999', marginBottom: '1rem' }}>
            {collection.images.length} image{collection.images.length !== 1 ? 's' : ''}
          </p>
          <div className="collection-images">
            {collection.images.map((image) => (
              <div key={image.id} className="collection-image-item">
                <img
                  src={image.imageUrl}
                  alt="Collection item"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3C/svg%3E';
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CollectionDetail;
