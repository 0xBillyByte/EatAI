# EatAI - Smart Food Management System

A clean, modern food management web application built with vanilla HTML, CSS, and JavaScript, featuring a Node.js backend with PostgreSQL database and Docker deployment.

## Features

- **Food Inventory Management**: Track food items with quantities and expiration dates
- **Smart Expiry Alerts**: Visual indicators for expired and soon-to-expire items
- **Shopping List**: Manage grocery items with checkbox functionality
- **Recipe Suggestions**: Get recipe ideas based on available ingredients
- **Dark Mode UI**: Apple-style dark theme with modern design
- **Fully Dockerized**: Easy deployment with Docker Compose

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: nginx

## Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Git (for cloning the repository)

2. **Clone and Run**
   ```bash
   git clone <repository-url>
   cd eatai
   docker-compose up -d
   ```

3. **Access the Application**
   - Frontend: http://localhost:81
   - Backend API: http://localhost:81/api
   - Direct Backend: http://localhost:3002

## API Endpoints

### Food Inventory
- `GET /api/food` - Get all food items
- `POST /api/food` - Add new food item
- `PUT /api/food/:id` - Update food item
- `DELETE /api/food/:id` - Delete food item

### Shopping List
- `GET /api/shopping` - Get shopping list
- `POST /api/shopping` - Add shopping item
- `PUT /api/shopping/:id` - Toggle item status
- `DELETE /api/shopping/:id` - Remove item

### Recipes
- `GET /api/recipes` - Get recipe suggestions

## Development

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
# Serve with any static file server
python -m http.server 8080
```

### Environment Variables
Create a `.env` file in the root directory:
```env
POSTGRES_USER=eatai
POSTGRES_PASSWORD=eatai123
POSTGRES_DB=eatai_db
```

## License

MIT