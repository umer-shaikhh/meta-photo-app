const request = require('supertest');
const chai = require('chai');
const app = require('../app')

const expect = chai.expect;

describe('Photos API', () => {

  it('should fetch photos without any filters', (done) => {
    request(app)
      .get('/externalapi/photos')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should filter photos by title', (done) => {
    request(app)
      .get('/externalapi/photos?title=sampleTitle')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        res.body.forEach(photo => {
          expect(photo.title).to.include('sampleTitle');
        });
        done();
      });
  });
});

