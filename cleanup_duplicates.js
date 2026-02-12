import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./server/models/Food.js";

dotenv.config({ path: "./server/.env" });

const cleanupDuplicates = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            console.error("MONGODB_URL not found in environment variables");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        const foods = await Food.find({});
        console.log(`Total food items before cleanup: ${foods.length}`);

        const seenNames = new Set();
        const duplicates = [];
        const uniqueIds = new Set();

        for (const food of foods) {
            // Create a unique key. You can make this more specific if needed
            // e.g. food.name + "|" + food.desc
            const key = food.name;

            if (seenNames.has(key)) {
                duplicates.push(food._id);
            } else {
                seenNames.add(key);
                uniqueIds.add(food._id);
            }
        }

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicate items to remove.`);
            const result = await Food.deleteMany({ _id: { $in: duplicates } });
            console.log(`Deleted ${result.deletedCount} duplicate items.`);
        } else {
            console.log("No duplicates found.");
        }

        const remainingFoods = await Food.find({});
        console.log(`Total food items after cleanup: ${remainingFoods.length}`);

        process.exit(0);
    } catch (err) {
        console.error("Error during cleanup:", err);
        process.exit(1);
    }
};

cleanupDuplicates();
