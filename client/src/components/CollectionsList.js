import React, { useState } from 'react';

function CollectionsList({ collections, onCreateCollection, onSelectCollection }) {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const handleCreateClick = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName);
      setNewCollectionName('');
      setShowNewForm(false);
    }
  };

  return (
    <div className="collections-list">
      {showNewForm && (
        <div className="collection-new">
          <input
            type="text"
            placeholder="Collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateClick();
              }
            }}
          />
          <button onClick={handleCreateClick}>Create</button>
          <button
            onClick={() => {
              setShowNewForm(false);
              setNewCollectionName('');
            }}
            style={{ marginLeft: '0.5rem', background: '#ddd', color: '#333' }}
          >
            Cancel
          </button>
        </div>
      )}

      {!showNewForm && (
        <div className="collection-new" onClick={() => setShowNewForm(true)}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+</div>
          <div>Create new collection</div>
        </div>
      )}

      {collections.map((collection) => (
        <div
          key={collection.id}
          className="collection-card"
          onClick={() => onSelectCollection(collection)}
        >
          <h3>{collection.name}</h3>
          <p>{collection.images.length} images</p>
          <small style={{ color: '#ccc' }}>
            {new Date(collection.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}

      {collections.length === 0 && !showNewForm && (
        <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#999' }}>
          No collections yet. Create one to start saving images!
        </div>
      )}
    </div>
  );
}

export default CollectionsList;
