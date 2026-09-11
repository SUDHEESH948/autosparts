const mongoose = require("mongoose");
const dns = require("dns");

// IMPORTANT: set DNS BEFORE mongoose.connect()
dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
]);

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MONGO_URI is missing");
        }

        console.log("DNS Servers:", dns.getServers());

        const safeUri = uri.replace(
            /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/i,
            "mongodb$1://$2:********@"
        );

        console.log("MongoDB URI:", safeUri);

        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
        });

        console.log("==========================================");
        console.log(" MongoDB Connected Successfully");
        console.log(` Host: ${connection.connection.host}`);
        console.log(` Database: ${connection.connection.name}`);
        console.log("==========================================");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 