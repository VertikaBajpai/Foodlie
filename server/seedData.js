import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./models/Food.js";

dotenv.config();

const sampleFoods = [
    {
        name: "Classic Burger",
        desc: "Juicy beef patty with fresh lettuce, tomatoes, and special sauce",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        price: { org: 8.99, mrp: 12.99, off: 31 },
        category: ["Burger"],
        ingredients: ["Beef", "Lettuce", "Tomato", "Cheese", "Bun"],
    },
    {
        name: "Margherita Pizza",
        desc: "Classic Italian pizza with fresh mozzarella, basil, and tomato sauce",
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        price: { org: 12.99, mrp: 16.99, off: 24 },
        category: ["Pizza"],
        ingredients: ["Mozzarella", "Basil", "Tomato Sauce", "Dough"],
    },
    {
        name: "Pepperoni Pizza",
        desc: "Loaded with pepperoni and melted cheese",
        img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
        price: { org: 14.99, mrp: 18.99, off: 21 },
        category: ["Pizza"],
        ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Dough"],
    },
    {
        name: "Chicken Biryani",
        desc: "Aromatic basmati rice with tender chicken and exotic spices",
        img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
        price: { org: 11.99, mrp: 15.99, off: 25 },
        category: ["Biriyanis"],
        ingredients: ["Chicken", "Basmati Rice", "Spices", "Yogurt"],
    },
    {
        name: "Mutton Biryani",
        desc: "Rich and flavorful biryani with succulent mutton pieces",
        img: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=500",
        price: { org: 15.99, mrp: 19.99, off: 20 },
        category: ["Biriyanis"],
        ingredients: ["Mutton", "Basmati Rice", "Spices", "Yogurt"],
    },
    {
        name: "Chocolate Brownie",
        desc: "Rich, fudgy chocolate brownie with a crispy top",
        img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500",
        price: { org: 5.99, mrp: 7.99, off: 25 },
        category: ["Dessert"],
        ingredients: ["Chocolate", "Butter", "Sugar", "Eggs", "Flour"],
    },
    {
        name: "Tiramisu",
        desc: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
        img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
        price: { org: 7.99, mrp: 10.99, off: 27 },
        category: ["Dessert"],
        ingredients: ["Mascarpone", "Coffee", "Ladyfingers", "Cocoa"],
    },
    {
        name: "Fresh Orange Juice",
        desc: "Freshly squeezed orange juice",
        img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500",
        price: { org: 3.99, mrp: 5.99, off: 33 },
        category: ["Beverages"],
        ingredients: ["Orange"],
    },
    {
        name: "Mango Smoothie",
        desc: "Creamy mango smoothie with a hint of cardamom",
        img: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500",
        price: { org: 4.99, mrp: 6.99, off: 29 },
        category: ["Beverages"],
        ingredients: ["Mango", "Milk", "Sugar", "Cardamom"],
    },
    {
        name: "Cheese Burger",
        desc: "Double cheese burger with caramelized onions",
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
        price: { org: 9.99, mrp: 13.99, off: 29 },
        category: ["Burger"],
        ingredients: ["Beef", "Cheese", "Onions", "Lettuce", "Bun"],
    },
    {
        name: "Veggie Burger",
        desc: "Healthy vegetarian burger with grilled vegetables",
        img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500",
        price: { org: 7.99, mrp: 10.99, off: 27 },
        category: ["Burger"],
        ingredients: ["Vegetables", "Lettuce", "Tomato", "Bun"],
    },
    {
        name: "Chicken Pasta",
        desc: "Creamy alfredo pasta with grilled chicken",
        img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
        price: { org: 10.99, mrp: 14.99, off: 27 },
        category: ["Pasta"],
        ingredients: ["Pasta", "Chicken", "Cream", "Parmesan"],
    },
    {
        name: "Caesar Salad",
        desc: "Fresh romaine lettuce with caesar dressing and croutons",
        img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500",
        price: { org: 6.99, mrp: 9.99, off: 30 },
        category: ["Salads"],
        ingredients: ["Romaine", "Caesar Dressing", "Croutons", "Parmesan"],
    },
    {
        name: "Chicken Tacos",
        desc: "Soft tacos filled with seasoned chicken and fresh toppings",
        img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
        price: { org: 8.99, mrp: 11.99, off: 25 },
        category: ["Tacos"],
        ingredients: ["Chicken", "Tortilla", "Lettuce", "Salsa", "Cheese"],
    },
    {
        name: "Vegetable Noodles",
        desc: "Stir-fried noodles with fresh vegetables",
        img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500",
        price: { org: 7.99, mrp: 10.99, off: 27 },
        category: ["Noodles"],
        ingredients: ["Noodles", "Vegetables", "Soy Sauce", "Garlic"],
    },
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        // Clear existing food items
        await Food.deleteMany({});
        console.log("Cleared existing food items");

        // Insert sample food items
        const insertedFoods = await Food.insertMany(sampleFoods);
        console.log(`✅ Successfully added ${insertedFoods.length} food items to the database!`);

        // Display the food items
        console.log("\nAdded food items:");
        insertedFoods.forEach((food, index) => {
            console.log(`${index + 1}. ${food.name} - $${food.price.org}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
