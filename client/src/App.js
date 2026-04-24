import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import CollectionsList from './components/CollectionsList';
import CollectionDetail from './components/CollectionDetail';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setPinResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [view, setView] = useState('search'); // 'search' or 'collections'

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPinResults(data.pins || []);
    } catch (error) {
      console.error('Search failed:', error);
      setPinResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (name) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const newCollection = await response.json();
      setCollections([...collections, newCollection]);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleAddToCollection = async (collectionId, imageUrl, pinId) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, pinId })
      });
      const updated = await response.json();

      setCollections(collections.map(c =>
        c.id === collectionId ? updated : c
      ));

      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(updated);
      }
    } catch (error) {
      console.error('Failed to add image:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📌 Picture Scrapper</h1>
        <p>Search & collect Pinterest images for your reference library</p>
      </header>

      <div className="App-container">
        <nav className="nav-tabs">
          <button
            className={`nav-button ${view === 'search' ? 'active' : ''}`}
            onClick={() => setView('search')}
          >
            Search
          </button>
          <button
            className={`nav-button ${view === 'collections' ? 'active' : ''}`}
            onClick={() => setView('collections')}
          >
            Collections ({collections.length})
          </button>
        </nav>

        {view === 'search' && (
          <div className="search-view">
            <SearchBar onSearch={handleSearch} />
            {searchResults.length > 0 && (
              <SearchResults
                results={searchResults}
                collections={collections}
                onAddToCollection={handleAddToCollection}
              />
            )}
            {loading && <div className="loading">Searching...</div>}
            {!loading && searchResults.length === 0 && searchQuery && (
              <div className="no-results">No results found for "{searchQuery}"</div>
            )}
          </div>
        )}

        {view === 'collections' && !selectedCollection && (
          <CollectionsList
            collections={collections}
            onCreateCollection={handleCreateCollection}
            onSelectCollection={setSelectedCollection}
          />
        )}

        {view === 'collections' && selectedCollection && (
          <CollectionDetail
            collection={selectedCollection}
            onBack={() => setSelectedCollection(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
