# Backend Architecture API - NodeJS

Welcome to the E-commerce Platform Backend API project! This project aims to build a robust, scalable, and maintainable backend architecture for an e-commerce platform. Our platform allows users to register as shop owners and list their products, providing a seamless experience for both sellers and buyers.

## Project Goals

- **Standardized Architecture**: Implement a clean and modular architecture following best practices to ensure the codebase is easy to understand and extend.
- **Scalability**: Design the system to handle a growing number of users, shops, and products efficiently.
- **Maintainability**: Ensure that the codebase is easy to maintain and update, with clear documentation and well-organized components.
- **Security**: Implement robust security measures to protect user data and ensure secure transactions.
- **Solid Business Logic**: Enforce strict business logic to handle various e-commerce operations accurately and reliably.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
<!-- - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Ad Management](#ad-management)
  - [Admin Functions](#admin-functions) -->
- [Middleware](#middleware)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication and Authorization**:

  - Secure user registration and login using JWT.
  - Role-based access control to distinguish between buyers and sellers.

- **Shop Management**:

  - CRUD operations for shop creation, updating, and deletion.
  - Association of products with specific shops.

- **Product Management**:

  - CRUD operations for product listing, updating, and deletion.
  - Handling product categories, tags, attributes, inventories, discount.

- **Order Management**:

  - Order placement, updating order status, and order history.
  - Payment processing integration and order validation.

- **Search and Filtering**:

  - Full-text search capabilities for products and shops.
  - Filtering based on categories, price range, ratings, etc.

- **Review and Rating System**:

  - CRUD operations for product and shop reviews.
  - Aggregation of ratings and feedback.

- **Notification System**:

  - Real-time notifications for order updates, new messages, and other events.
  - Email and push notification integration.

- **Admin Panel**:
  - Dashboard for managing users, shops, products, and orders.
  - Monitoring and reporting tools for system health and performance.

## Tech Stack

- **Programming Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB, Redis
- **Authentication**: JWT (JSON Web Tokens), API Key
<!-- - **API Documentation**: Swagger / OpenAPI -->
- **Deployment**: Docker
- **Testing**: Jest
- **Other**: RabbitMQ

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- MongoDB (for database)

### Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/duynguyen1805/BackendArchitectureNodeJS.git
   ```

2. **Install dependencies**

   ```
   npm install
   #or
   yarn install
   ```

3. **Environment Variables**

   Create a .env file in the root directory and configure the following environment variables:

   ```
   PORT=3000
   URL_FONTEND=your_frontend_url
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=your_mongodb_connection_string
   DEV_APP_PORT=4000
   DEV_DB_PORT=27017
   DEV_DB_HOST=localhost
   DEV_DB_NAME=database_name

   CHANNELID_DISCORD=your_ChannelId_DISCORD
   TOKEN_DISCORD=your_Token_DISCORD

   CLOUDINARY_NAME=your_CLOUDINARY_NAME
   CLOUDINARY_API_SECRET_KEY=your_CLOUDINARY_API_SECRET_KEY
   CLOUDINARY_API_KEY=your_CLOUDINARY_API_KEY

   ```

### Running the Application

    To start the development server:

    ```
    npm start
    # or
    yarn start

    ```

### Project Structure

```
2handmarket_be/
├── config/db           # Config database mongodb connection
├── controllers/        # Route handlers
├── middlewares/        # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── utils/              # Utility functions
├── .env                # Environment variables
├── app.js              # Express app setup
├── server.js           # Entry point of the application
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation

```

### Middleware

- **Authentication Middleware:** Verify JWT tokens and protect routes.
- **Authorization Middleware:** Check user roles and permissions for accessing specific endpoints.

### Configuration

Configure the application using environment variables defined in the .env file. Adjust the MongoDB connection string and JWT secret as needed.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any feature additions, bug fixes, or improvements.
1
