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


});

