# Picture Scrapper

A web app to search Pinterest for reference images and organize them into collections for your magazine projects.

## Features

- 🔍 **Search Pinterest** - Find images by keyword (e.g., "gym girl", "at home cozy")
- 📌 **Create Collections** - Organize images into custom collections
- 💾 **Export Collections** - Save collections as JSON for upload to Higgsfield AI
- 📱 **Clean UI** - Pinterest-inspired interface for easy browsing

## Setup

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. Install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

2. Start the development server:
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Running Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
cd client && npm start
```

## How to Use

1. **Search** - Go to the Search tab and enter a query (e.g., "at home barefoot", "gym girl")
2. **Collect** - Click "Add to collection" on any image
3. **Manage** - View and organize collections in the Collections tab
4. **Export** - Export collections as JSON to manually upload to Higgsfield AI

## Project Structure

```
picture-scrapper/
├── server/
│   ├── index.js              # Express app
│   ├── routes/
│   │   ├── search.js         # Pinterest search endpoint
│   │   └── collections.js    # Collection management
│   └── data/
│       └── collections.json  # Stored collections
├── client/
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── package.json
```

## API Endpoints

### Search
- `GET /api/search?query=<search_term>` - Search Pinterest

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create new collection
- `POST /api/collections/:id/images` - Add image to collection
- `DELETE /api/collections/:id/images/:imageId` - Remove image from collection
- `GET /api/collections/:id/export` - Export collection

## Important Notes

**Pinterest ToS**: This tool scrapes Pinterest, which may violate their Terms of Service. Use for internal reference only.

## Next Steps

- [ ] Add Pinterest API integration for legal access
- [ ] Add image filters and sorting
- [ ] Add team collaboration features
- [ ] Add drag-and-drop reordering
- [ ] Add board creation on Higgsfield directly
