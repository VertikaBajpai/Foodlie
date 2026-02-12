
const fs = require('fs');
const https = require('http'); // using fetch actually.

const baseUrl = 'http://localhost:8080/api';

async function log(msg) {
    console.log(msg);
    fs.appendFileSync('test_cart_result.txt', msg + '\n');
}

async function test() {
    try {
        fs.writeFileSync('test_cart_result.txt', ''); // clear file

        // 1. Get products
        log('Fetching products...');
        const productsRes = await fetch(`${baseUrl}/food`);
        const products = await productsRes.json();
        if (!products || products.length === 0) {
            log('No products found');
            return;
        }
        const productId = products[0]._id;
        log(`Found product: ${products[0].name} (${productId})`);

        // 2. Sign up user
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';
        log(`Signing up user: ${email}`);
        const signupRes = await fetch(`${baseUrl}/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password })
        });

        const signupData = await signupRes.json();
        if (!signupRes.ok) {
            log(`Signup failed: ${JSON.stringify(signupData)}`);
            return;
        }

        const token = signupData.token;
        log('User signed up, token received.');

        // 3. Add to cart
        log('Adding to cart...');
        const addToCartRes = await fetch(`${baseUrl}/user/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        if (!addToCartRes.ok) {
            const err = await addToCartRes.text();
            log(`Add to cart failed status: ${addToCartRes.status} body: ${err}`);
        } else {
            const addToCartData = await addToCartRes.json();
            log(`Add to cart response: ${JSON.stringify(addToCartData)}`);
        }

        // 4. Get cart
        log('Fetching cart...');
        const getCartRes = await fetch(`${baseUrl}/user/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!getCartRes.ok) {
            const err = await getCartRes.text();
            log(`Get cart failed status: ${getCartRes.status} body: ${err}`);
        } else {
            const cartData = await getCartRes.json();
            log(`Cart data (raw): ${JSON.stringify(cartData)}`);
            log(`Cart item count: ${cartData.length}`);
            if (cartData.length > 0) {
                log(`First item: ${JSON.stringify(cartData[0])}`);
                log(`Product in cart: ${JSON.stringify(cartData[0].product)}`);
            }
        }

    } catch (error) {
        log(`Error: ${error.message}`);
        log(error.stack);
    }
}

test();
