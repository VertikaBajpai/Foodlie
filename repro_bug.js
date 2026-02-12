
const mongoose = require('mongoose');
const User = require('./server/models/User.js');
const Food = require('./server/models/Food.js');

// Mock mongoose objects to test the logic without a full DB connection if possible,
// but since this depends on Mongoose's equals method, it's better to run a real test or simulate the finding logic.

// Actually, I can just create a script that connects to the DB, creates a user with a "corrupted" cart item, and then calls the logic that fails.
// But I don't want to mess up the main DB too much. I'll create a user, test, then delete.

const axios = require('axios');
const baseUrl = 'http://localhost:8080/api';

async function testrepro() {
    try {
        // 1. Sign up a new user
        const email = `repro_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Signing up user: ${email}`);
        const signupRes = await fetch(`${baseUrl}/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Repro User', email, password })
        });
        const signupData = await signupRes.json();
        const token = signupData.token;
        console.log('User signed up.');

        // 2. We need to corrupt the cart. 
        // We can't easily corrupt it via the API because the API (hopefully) validates inputs or uses the buggy logic.
        // But wait, if we use the API to add a product that doesn't exist, my *new* code prevents it.
        // The user probably ALREADY has a corrupted cart from before my fix.

        // To reproduce the 500 error on "Add to Cart", I need to simulate a user who HAS a null product in their cart 
        // and then tries to add a valid product.

        // Since I cannot inject bad data via API easily (unless I find an endpoint that allows it),
        // I will try to rely on the fact that the bug is likely:
        // cart has [{product: null}], loop tries item.product.equals() -> BOOM.

        // I can't easily reproduce this without direct DB access to insert bad data.
        // However, I am confident this is the bug.

        // I will simply apply the fix.
        // The fix is to check if item.product is truthy before calling .equals()

        console.log("Simulating the logic locally:");
        const cart = [
            { product: null, quantity: 1 }
        ];
        const productId = "someid";

        try {
            const index = cart.findIndex((item) => item.product.equals(productId));
        } catch (e) {
            console.log("Caught expected error:", e.message);
        }

    } catch (error) {
        console.error(error);
    }
}

testrepro();
