// db.js or connectDb.js
import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection error:", error.message);
        process.exit(1); // Optional: Exit app on failure
    }
};

export default connectDb;
