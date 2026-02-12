import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./models/Food.js"; // Correct path relative to server root

dotenv.config();

const removeDuplicateFoods = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            console.error("MONGODB_URL not found in .env file");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        const foods = await Food.find({});
        console.log(`Total food items found: ${foods.length}`);

        const seen = new Set();
        const duplicates = [];

        for (const food of foods) {
            // Create a unique key based on name and description to identify duplicates
            const key = `${food.name}|${food.desc}|${food.category.join(",")}`;

            if (seen.has(key)) {
                duplicates.push(food._id);
            } else {
                seen.add(key);
            }
        }

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicate items.`);
            const result = await Food.deleteMany({ _id: { $in: duplicates } });
            console.log(`Successfully deleted ${result.deletedCount} items.`);
        } else {
            console.log("No duplicates found.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error removing duplicates:", err);
        process.exit(1);
    }
};

removeDuplicateFoods();
