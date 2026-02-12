# Food Delivery Website - Backend Setup

## Issue: Items not being added to cart

**Root Cause:** The backend server needs a MongoDB database connection to store user data, cart items, and orders.

## Solution: Set up MongoDB Database

### Option 1: MongoDB Atlas (Recommended - Free & Easy)

1. **Create a MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Set up Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Set up Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Your Connection String:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add the database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/fooddelivery?retryWrites=true&w=majority`

6. **Update the .env file:**
   - Open `server/.env`
   - Replace the `MONGODB_URL` value with your connection string
   - Save the file

7. **Restart the backend server:**
   - The server should automatically restart (nodemon)
   - You should see "Connected to Mongo DB" in the console

### Option 2: Local MongoDB (Advanced)

1. Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start the MongoDB service
3. Update `MONGODB_URL` in `.env` to: `mongodb://localhost:27017/fooddelivery`

## Verify It's Working

Once MongoDB is connected:
1. Sign up for a new account on the website
2. Try adding items to cart
3. You should see success messages and items should appear in your cart

## Current Status

✅ Frontend is running (port 3000)
✅ Backend is running (port 8080)
❌ MongoDB connection is NOT configured (needs setup)

The backend server is running but cannot save data without a MongoDB connection.
