const mongoose = require('mongoose');
const Job = require('./models/Job'); // Job 모델 불러오기
const fs = require('fs');
const csv = require('csv-parser');

// MongoDB 연결 함수
async function connectDB() {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect('mongodb://localhost:27017/wsd', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB 연결 성공');
      } catch (error) {
        console.error('MongoDB 연결 실패:', error);
        process.exit(1);
      }
    } else {
      console.log('MongoDB 이미 연결됨');
    }
  }

// CSV 데이터를 MongoDB에 저장
async function saveCsvToDB(csvFilePath) {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB 연결이 완료되지 않았습니다.');
      }
  
      const jobs = [];
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          jobs.push(row);
        })
        .on('end', async () => {
          console.log('CSV 파일 읽기 완료. 데이터 저장 시작...');
          for (const job of jobs) {
            const existingJob = await Job.findOne({ link: job['링크'] });
            if (existingJob) {
              console.log(`중복 데이터 건너뜀: ${job['제목']}`);
              continue;
            }
  
            const newJob = new Job({
              companyId: job['회사명'],
              jobTitle: job['제목'],
              link: job['링크'],
              location: job['지역'],
              experienceRequired: job['경력'],
              educationRequired: job['학력'] || null,
              salary: job['연봉'] || null,
              employmentType: job['고용형태'],
              deadline: job['마감일'] ? new Date(job['마감일']) : null,
              details: {
                  skills: job['직무분야'] ? job['직무분야'].split(',') : [],
                benefits: job['연봉정보'] ? job['연봉정보'].split(',') : [],
              },
            });
  
            await newJob.save();
            console.log(`저장 완료: ${job['제목']}`);
          }
          console.log('CSV 데이터 MongoDB 저장 완료');
        });
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
    }
  }

// 실행
(async () => {
  await connectDB();

  const csvFilePath = 'saramin_jobs_unique.csv'; // CSV 파일 경로
  // MongoDB 연결 확인 후 CSV 저장
  if (mongoose.connection.readyState === 1) {
    await saveCsvToDB(csvFilePath);
  } else {
    console.error('MongoDB 연결 상태가 유효하지 않습니다.');
  }
  mongoose.disconnect(); // 작업 완료 후 연결 해제
})();
