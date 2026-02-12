import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./server/models/Food.js";

dotenv.config({ path: "./server/.env" });

const checkDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        const foods = await Food.find({});
        console.log(`Total food items: ${foods.length}`);

        const seen = new Set();
        const duplicates = [];

        foods.forEach((food) => {
            // Create a unique key based on name and description (or other unique attributes)
            // Since _id is always unique, we look for content duplicates.
            const key = `${food.name}|${food.desc}`;
            if (seen.has(key)) {
                duplicates.push(food);
            } else {
                seen.add(key);
            }
        });

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicate items (same name and desc):`);
            duplicates.forEach((d) => console.log(`- ${d.name} (${d._id})`));
        } else {
            console.log("No content duplicates found.");
        }

        // Check if getAllProducts in controller might be returning duplicates due to join/filter logic?
        // The controller uses Food.find(filter). If filter corresponds to multiple matches?
        // But find() returns documents. Unless populates are involved or aggregation?
        // The current getFoodItems just does a simple find.

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDuplicates();
