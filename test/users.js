let mongoose = require("mongoose");
let User = require('../models/Users');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../Server');
let should = chai.should();
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDI2YWUyODgxNGViYzBlOTQ3NzE1YzkiLCJpYXQiOjE2MTMxNDc3MTUsImV4cCI6MTYxNTczOTcxNX0.b-7xGxCIesSrRClboBZrm-1QmOQG0fpo8gP6Do2RBXI'

chai.use(chaiHttp);

describe('Users', () => {
    
  describe('/GET Users', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/api/v1/users')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
                console.log(err);
                  res.should.have.status(200);
              done();
            });
      });
  });

  describe('/GET User with id', () => {
    it('it should GET user with id 1', (done) => {
      chai.request(server)
          .get('/api/v1/users/1')
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
              console.log(err);
                res.should.have.status(200);
            done();
          });
    });
  });

  describe('/DELETE User with id', () => {
    it('it should DELETE user with id 1', (done) => {
      chai.request(server)
          .delete('/api/v1/users/1')
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
              console.log(err);
                res.should.have.status(200);
            done();
          });
    });
  });

});