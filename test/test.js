const request = require('supertest');
const app = require('../index'); // Asegúrate de que la ruta sea correcta

describe('API Routes', () => {
  let expect;

  before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  });

  it('should return employees with black badges', (done) => {
    request(app)
      .get('/employees/black-badges')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        res.body.forEach(employee => {
          expect(employee.badges).to.include('black');
        });
        done();
      });
  });

  it('should return employee by name', (done) => {
    const name = 'Sue'; // Asegúrate de que este nombre exista en tu archivo employees.json
    request(app)
      .get(`/employees/name/${name}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal(name);
        done();
      });
  });

  it('should return 404 if employee not found', (done) => {
    const name = 'Nonexistent Name';
    request(app)
      .get(`/employees/name/${name}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.code).to.equal('not_found');
        done();
      });
  });
});