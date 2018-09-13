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
      .get('/api/v1/orders')
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });

  describe('/GET single order', () => {
    it('it should get a single order', done => {
      chai.request(app)
      .get('/api/v1/orders/1')
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
      .get('/api/v1/orders/30')
      .end((err,res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('The given order cant be found in the database');
        done();
      });
    });
  });

   it('It should Post an order', done => {
  let order =  {
    desc: 'fried rice and chicken',
    quantity: 7,
    price: 750,
  }
    chai.request(app)
    .post('/api/v1/orders')
    .send(order)
    .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('order was successfully posted');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('order');
        done();   
    });
  })
});

describe('/Post',() => {
 

  // it('It shouldnt Post an order with missing fields', done => {
  //    const order = {
  //         quantity:7,
  //         price:23
  // };
  //   chai.request(app)
  //   .post('/api/v1/orders')
  //   .send(order)
  //   .end((err,res) => {
  //       res.should.have.status(403);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('message');
  //       res.body.should.have.property('success').eql(false); 
  //        done();
  //   });
  // })
});
