# Adaptech - Frontend

Web interface for a marketplace where users can sign up, browse products by category and, if they are sellers, manage their own catalog. University project.

## Tech Stack

- Next.js and React
- React Bootstrap
- JavaScript

## Features

- User registration and login with roles (buyer, seller, administrator)
- Product catalog with category filtering
- Seller dashboard to create, edit and delete products (CRUD)
- User profile

## Requirements

- Node.js 18 or higher
- The Adaptech API running (see the `adaptech-api` repository)

## Getting Started

1. Clone the repository and install dependencies:

```
git clone https://github.com/santiagobetancurdev-lang/adaptech-fronted.git
cd adaptech-frontend
npm install
```

2. (Optional) Create a `.env.local` file with the API URL. If it is missing, the app defaults to `http://localhost:8080`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Start the development server:

```
npm run dev
```

4. Open http://localhost:3000 in your browser.

## Screenshots

[Add 2-3 screenshots here: home page, login, product dashboard]

## Roadmap

- Complete shopping cart and checkout flow
- JWT authentication
- Search and price filters
- Responsive design
- Deployment on Vercel

## Author

Santiago Betancur Petrel - https://www.linkedin.com/in/santiago-betancur-460abb425