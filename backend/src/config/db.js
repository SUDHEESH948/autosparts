const mongoose = require("mongoose");
const dns = require("dns");

// Optimize DNS resolution for Node & Windows: prefer IPv4
try {
    dns.setDefaultResultOrder("ipv4first");
} catch (err) {
    // Older Node versions might not support setDefaultResultOrder
}

// Resilient public DNS servers (Cloudflare + Google) to bypass restrictive/failing ISP DNS
dns.setServers([
    "1.1.1.1",
    "8.8.8.8",
    "1.0.0.1",
    "8.8.4.4",
]);

// Mongoose connection options for reliability on cloud MongoDB Atlas
const mongooseOptions = {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4 to prevent Windows/Node IPv6 dual-stack timeouts
    maxPoolSize: 10,
};

// Register connection lifecycle event listeners
let listenersAttached = false;
const attachConnectionListeners = () => {
    if (listenersAttached) return;
    listenersAttached = true;

    mongoose.connection.on("connected", () => {
        console.log("Mongoose connection established");
    });

    mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("Mongoose disconnected from MongoDB. Reconnecting...");
    });

    mongoose.connection.on("reconnected", () => {
        console.log("Mongoose reconnected to MongoDB successfully");
    });
};

const connectDB = () => {
    attachConnectionListeners();

    return new Promise((resolve) => {
        const attemptConnection = async (attempt = 1) => {
            try {
                const uri = process.env.MONGO_URI;

                if (!uri) {
                    throw new Error("MONGO_URI is missing in environment variables");
                }

                const safeUri = uri.replace(
                    /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/i,
                    "mongodb$1://$2:********@"
                );

                console.log(`[MongoDB] Connecting (attempt ${attempt})... URI: ${safeUri}`);

                const connection = await mongoose.connect(uri, mongooseOptions);

                console.log("==========================================");
                console.log(" MongoDB Connected Successfully");
                console.log(` Host: ${connection.connection.host}`);
                console.log(` Database: ${connection.connection.name}`);
                console.log("==========================================");

                resolve(connection);
            } catch (error) {
                console.error(`[MongoDB] Connection failed: ${error.message}`);
                console.log("[MongoDB] Retrying connection in 5 seconds (server will stay running)...");
                // Do NOT call process.exit(1) so nodemon / Express server doesn't crash
                setTimeout(() => attemptConnection(attempt + 1), 5000);
            }
        };

        attemptConnection();
    });
};

module.exports = connectDB;