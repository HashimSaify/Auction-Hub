# Auction Hub

A modern online auction platform built with Next.js, MongoDB, and TypeScript.

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Render account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000  # Update this in production
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Render

1. Push your code to a GitHub/GitLab repository
2. Sign up/Login to [Render](https://render.com)
3. Click "New +" and select "Web Service"
4. Connect your repository
5. Configure your web service:
   - **Name**: auction-hub
   - **Region**: Choose the closest to your users
   - **Branch**: main (or your production branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier available

6. Add the following environment variables in the Render dashboard:
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string
   - `NEXTAUTH_SECRET`: Generate a secure random string
   - `NEXTAUTH_URL`: Your Render URL (e.g., https://your-app.onrender.com)
   - `PORT`: 10000

7. Click "Create Web Service"

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT token generation | Yes | - |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes | - |
| `NEXTAUTH_URL` | Base URL of your application | Yes | http://localhost:3000 |
| `NODE_ENV` | Application environment | No | development |
| `PORT` | Port to run the server on | No | 3000 |

## Features

- User authentication and authorization
- Create and manage auctions
- Place bids on active auctions
- Real-time updates
- Responsive design

## Technologies Used

- Next.js 14
- TypeScript
- MongoDB
- Mongoose
- NextAuth.js
- Tailwind CSS
- Radix UI

## License

MIT
