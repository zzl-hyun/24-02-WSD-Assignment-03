const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Express 애플리케이션 불러오기
const { profile } = require('winston');
const { expect } = chai;

chai.use(chaiHttp);

// 테스트를 위한 JWT 토큰 (테스트 환경에서 발급받은 토큰을 사용)
const validToken = 'your_valid_jwt_token';
const invalidToken = 'your_invalid_jwt_token';

describe('Auth API Tests', () => {
  // 회원가입 테스트
  describe('POST /test/auth/register', () => {
    // it('should register a new user', (done) => {
    //   const newUser = {
    //     username: 'newuser',
    //     email: 'newuser@example.com',
    //     password: 'newpassword',
    //     profile: {
    //         fullName: 'New User',
    //         phoneNumber: '123-456-7890',
    //     }
    //   };
  
    //   chai.request(app)
    //     .post('/test/auth/register')
    //     .send(newUser)
    //     .end((err, res) => {
    //       expect(res).to.have.status(201);
    //       expect(res.body).to.have.property('status', 'success');
    //       expect(res.body.data).to.have.property('username', 'newuser');
    //       expect(res.body.data).to.have.property('email', 'newuser@example.com');
    //       expect(res.body.data).to.have.property('role', 'jobseeker');
    //       expect(res.body.data.profile).to.have.property('fullName', 'New User');
    //       expect(res.body.data.profile).to.have.property('phoneNumber', '123-456-7890');
    //       expect(res.body.data).to.have.property('_id').that.is.a('string');
    //       expect(res.body.data).to.have.property('createdAt').that.is.a('string');
    //       expect(res.body.data).to.have.property('updatedAt').that.is.a('string');
    //       done();
    //     });
    // });
  
    it('should return 400 for duplicate email', (done) => {
      const duplicateUser = {
        username: 'duplicate',
        email: 'newuser@example.com', // 이미 등록된 이메일
        password: 'password123',
        profile: {
            fullName: 'Duplicate User',
            phoneNumber: '987-654-3210',
        }
      };
  
      chai.request(app)
        .post('/test/auth/register')
        .send(duplicateUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('code', 'ALREADY_REGISTERED');
          expect(res.body).to.have.property('message', 'Email is already registered.');
          done();
        });
    });
  });
  

  // 로그인 테스트
  describe('POST /auth/login', () => {
    it('should log in an existing user and return a token', (done) => {
      const loginData = {
        email: 'newuser@example.com',
        password: 'newpassword',
      };

      chai.request(app)
        .post('/test/auth/login')
        .send(loginData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body.data).to.have.property('accessToken');
          done();
        });
    });

    it('should return 401 for invalid credentials', (done) => {
      const invalidLogin = {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      };

      chai.request(app)
        .post('/test/auth/login')
        .send(invalidLogin)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status', 'error');
          expect(res.body).to.have.property('code', 'INVALID_CREDENTIALS');
          expect(res.body).to.have.property('message', 'Invalid email or password.');
          done();
        });
    });
  });

//   // 프로필 조회 테스트
//   describe('GET /auth/profile', () => {
//     it('should return the user profile for a valid token', (done) => {
//       chai.request(app)
//         .get('/auth/profile')
//         .set('Authorization', `Bearer ${validToken}`)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('status', 'success');
//           expect(res.body.data).to.have.property('username', 'testuser');
//           done();
//         });
//     });

//     it('should return 401 for an invalid token', (done) => {
//       chai.request(app)
//         .get('/auth/profile')
//         .set('Authorization', `Bearer ${invalidToken}`)
//         .end((err, res) => {
//           expect(res).to.have.status(401);
//           expect(res.body).to.have.property('error');
//           done();
//         });
//     });
//   });

//   // 프로필 업데이트 테스트
//   describe('PUT /auth/profile', () => {
//     it('should update the user profile', (done) => {
//       const updatedProfile = {
//         fullName: 'Updated User',
//         phoneNumber: '321-654-9870',
//       };

//       chai.request(app)
//         .put('/auth/profile')
//         .set('Authorization', `Bearer ${validToken}`)
//         .send(updatedProfile)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('status', 'success');
//           expect(res.body.data).to.have.property('fullName', updatedProfile.fullName);
//           done();
//         });
//     });

//     it('should return 400 for invalid input', (done) => {
//       const invalidProfile = {
//         fullName: '', // 빈 이름
//         phoneNumber: 'invalidphone', // 잘못된 전화번호 형식
//       };

//       chai.request(app)
//         .put('/auth/profile')
//         .set('Authorization', `Bearer ${validToken}`)
//         .send(invalidProfile)
//         .end((err, res) => {
//           expect(res).to.have.status(400);
//           expect(res.body).to.have.property('error');
//           done();
//         });
//     });
//   });

//   // 로그아웃 테스트
//   describe('POST /auth/logout', () => {
//     it('should log out the user', (done) => {
//       chai.request(app)
//         .post('/auth/logout')
//         .set('Authorization', `Bearer ${validToken}`)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('status', 'success');
//           expect(res.body.message).to.equal('Logged out successfully');
//           done();
//         });
//     });
//   });
});
