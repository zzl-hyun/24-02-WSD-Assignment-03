// const app = require('../src/app.js');
// const chai = require('chai');
// const chaiHttp = require('chai-http');

// chai.use(chaiHttp);
// const { expect } = chai;

// describe('CSRF API', () => {
//   it('should return a CSRF token', (done) => {
//     chai.request(app)
//       .get('/api/csrf-token')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('csrfToken');
//         done();
//       });
//   });
// });

// // return;