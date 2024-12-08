// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../src/app.js');
// const { expect } = chai;

// chai.use(chaiHttp);

// // 테스트 데이터
// const adminToken = 'your_admin_jwt_token'; // 실제 테스트용 JWT 토큰을 삽입
// const invalidToken = 'invalid_jwt_token';
// const applicationId = 'example_application_id';
// const jobId = 'example_job_id';

// describe('Admin API Tests', () => {
//   describe('GET /admin/applications', () => {
//     it('should retrieve all applications for an admin', (done) => {
//       chai.request(app)
//         .get('/admin/applications')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.be.an('object');
//           expect(res.body.status).to.equal('success');
//           expect(res.body.data).to.be.an('array');
//           done();
//         });
//     });

//     it('should return 401 if the token is invalid', (done) => {
//       chai.request(app)
//         .get('/admin/applications')
//         .set('Authorization', `Bearer ${invalidToken}`)
//         .end((err, res) => {
//           expect(res).to.have.status(401);
//           expect(res.body).to.have.property('error');
//           done();
//         });
//     });
//   });

//   describe('PUT /admin/applications/:id', () => {
//     it('should update the status of an application', (done) => {
//       chai.request(app)
//         .put(`/admin/applications/${applicationId}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({ status: 'Accepted' })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.be.an('object');
//           expect(res.body.status).to.equal('success');
//           expect(res.body.data).to.have.property('id', applicationId);
//           expect(res.body.data).to.have.property('status', 'Accepted');
//           done();
//         });
//     });

//     it('should return 400 if the status is invalid', (done) => {
//       chai.request(app)
//         .put(`/admin/applications/${applicationId}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({ status: 'InvalidStatus' })
//         .end((err, res) => {
//           expect(res).to.have.status(400);
//           expect(res.body).to.have.property('error');
//           done();
//         });
//     });
//   });

//   describe('DELETE /admin/jobs/:id', () => {
//     it('should delete a job if valid credentials are provided', (done) => {
//       chai.request(app)
//         .delete(`/admin/jobs/${jobId}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({ passwordHash: 'valid_password_hash' })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.be.an('object');
//           expect(res.body.status).to.equal('success');
//           expect(res.body.data).to.have.property('id', jobId);
//           done();
//         });
//     });

//     it('should return 400 if passwordHash is missing', (done) => {
//       chai.request(app)
//         .delete(`/admin/jobs/${jobId}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({})
//         .end((err, res) => {
//           expect(res).to.have.status(400);
//           expect(res.body).to.have.property('error');
//           done();
//         });
//     });
//   });
// });
