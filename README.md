# EatAI - Smart Food Management System

A clean, modern food management web application built with vanilla HTML, CSS, and JavaScript, featuring a Node.js backend with PostgreSQL database and Docker deployment.

## Features

- **Food Inventory Management**: Track food items with quantities and expiration dates
- **Smart Expiry Alerts**: Visual indicators for expired and soon-to-expire items
- **Shopping List**: Manage grocery items with checkbox functionality
- **Recipe Suggestions**: Get recipe ideas based on available ingredients

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL

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
