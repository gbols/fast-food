import chai from 'chai';
import chaiHttp from 'chai-http';
import app from "../src/app";
import db from '../src/model';

const should = chai.should();

chai.use(chaiHttp);

describe('Orders',() => {
  // beforeEach(done => {
  //   db.remove({}, err => {
  //     done();
  //   });
  // });

  describe('/GET order', () => {
    it('it should get all the orders', done => {
      chai.request(app)
      .get('/api/v1/users/orders')
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(2);
        done();
      });
    });
  });

  describe('/GET single order', () => {
    it('it should get a single order', done => {
      chai.request(app)
      .get('/api/v1/users/orders/1')
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql('order was successfully found');
        res.body.should.have.property('order');
        done();
      });
    });
  });

    describe('/GET single order with invalid id', () => {
    it('it should return an error object', done => {
      chai.request(app)
      .get('/api/v1/users/orders/3')
      .end((err,res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('The given order cant be found in the database');
        done();
      });
    });
  });

});

