//config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        const db = connection.connection.db;
        const userInfo = await db.command({ connectionStatus: 1 });
        console.log('MongoDB Connected...', userInfo.authInfo.authenticatedUsers);

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

