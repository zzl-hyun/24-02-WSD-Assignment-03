const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const Company = require('../models/Company.js');
const Job = require('../models/Job');


const parseSalary = (salaryString) => {
    if (!salaryString) return null;

    const regex = /([\d,]+)\s*(만원|원)/i;
    const match = salaryString.match(regex);

    if (!match) return null;

    const rawValue = parseInt(match[1].replace(/,/g, ''), 10); // Remove commas and parse the number
    const unit = match[2];

    if (unit === '만원') {
        return rawValue * 10000; // Convert 만원 to 원
    } else if (unit === '원') {
        return rawValue; // Already in 원
    }

    return null;
};
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/wsd', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process on connection failure
    }
};

const updateNormalizedSalaries = async () => {
    const jobs = await Job.find({});
    for (const job of jobs) {
        job.normalizedSalary = parseSalary(job.salary);
        await job.save();
    }
    console.log('Updated all salaries');
};

const main = async () => {
    try {
        await connectDB(); // Ensure MongoDB is connected
        await updateNormalizedSalaries();
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await mongoose.disconnect(); // Disconnect from MongoDB
        console.log('MongoDB disconnected.');
    }
};
main();
