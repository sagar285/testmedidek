import mongoose from "mongoose";


export const dbConnection = async () => {
    const db = process.env.DB_URL
    try {
        await mongoose.connect(db)
        console.log("Database Connected")
    } catch (error) {
        process.exit(1);
    }
};

