const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const Company = require('./models/Company.js');
const Job = require('./models/Job.js');

// Normalize string
// const normalize = (str) => str.trim().toLowerCase();

// MongoDB connection
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

// Import job data
const importJobs = () => {
  return new Promise((resolve, reject) => {
    const jobData = [];
    fs.createReadStream('./jobs.csv')
      .pipe(csvParser())
      .on('data', (row) => {
        const normalizedCompanyName = row['회사명'];
        jobData.push(async () => {
          const company = await Company.findOne({
            company_name: normalizedCompanyName, // 정확한 매칭
          });

          return {
            companyId: company ? company._id : null, // 회사가 없으면 null
            jobTitle: row['제목'] || 'NA',
            link: row['링크'] || 'NA',
            location: row['지역'] || 'NA',
            experienceRequired: row['경력'] || 'NA',
            educationRequired: row['학력'] || 'NA',
            salary: row['연봉'] || 'NA',
            employmentType: row['고용형태'] || 'NA',
            deadline: row['마감일'] || 'NA',
            details: {
              skills: (row['직무분야'] || '')
                .replace(/\s외\s.*$/, '') // "외" 이후 텍스트 제거
                .split(',')
                .map(skill => skill.trim()), // 양쪽 공백 제거
              benefits: (row['연봉정보'] || '')
                .split(',')
                .map(benefit => benefit.trim()), // 양쪽 공백 제거
            },
            
          };
        });
      })
      .on('end', async () => {
        try {
          const jobsToInsert = await Promise.all(jobData.map((job) => job()));
          await Job.insertMany(jobsToInsert);
          console.log('Jobs imported successfully');
          resolve();
        } catch (err) {
          console.error('Error importing jobs:', err);
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('Error reading jobs.csv:', err);
        reject(err);
      });
  });
};

// Main execution logic
const main = async () => {
  try {
    await connectDB(); // Ensure MongoDB is connected
    await importJobs(); // Import job data
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await mongoose.disconnect(); // Disconnect from MongoDB
    console.log('MongoDB disconnected.');
  }
};

// Execute the script
main();
