import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import app from '../src/app';

const should = chai.should();
dotenv.config();

chai.use(chaiHttp);
describe('/SIGNUP', () => {
  it('it should allow a user signup with  valid credentials', (done) => {
    const signup = {
      username: 'tunde',
      password: 'tunde@tunde',
      email: 'tunde@tunde.com',
      address: '4 Napier Garden Lekki Lagos',
      phone: '0810 954 8778',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(signup)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('user account successfully created!....');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have.property('token');
        done();
      });
  });

  it("it should'nt allow a user signup with the same credentials twice", (done) => {
    const signup = {
      username: 'tunde',
      password: 'tunde@tunde',
      email: 'tunde@tunde.com',
      address: '4 Napier Garden Lekki Lagos',
      phone: '0810 954 8778',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(signup)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have
          .property('message')
          .eql('user with credentials already exits');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });


  it("it should'nt allow improper input fileds", (done) => {
    const signup = {
      username: 'tunde',
      password: '',
      email: 'tunde@tunde.com',
      address: '4 Napier Garden Lekki Lagos',
      phone: '0810 954 8778',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(signup)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });
});

describe('/LOGIN', () => {
  it('it should allow a user login with credentials', (done) => {
    const log = {
      username: 'tunde',
      password: 'tunde@tunde',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(log)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('user successfully logged In!....');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have.property('token');
        done();
      });
  });

  it("it should'nt allow a user login with incorrect password", (done) => {
    const log = {
      username: 'tunde',
      password: 'gbolhan',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(log)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('message')
          .eql('Invalid username or password');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow a user that doesnt exits to login", (done) => {
    const log = {
      username: 'dayork',
      password: 'gbolhan',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(log)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('message')
          .eql('Invalid username or password');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow improper input fileds", (done) => {
    const log = {
      username: '',
      password: 'gbolhan',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(log)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });
});
describe('/SIGNOUT', () => {
  it('it should allow a user to signout of the app', (done) => {
    chai
      .request(app)
      .get('/api/v1/signout')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('you have successfully signed out');
        res.body.should.have
          .property('success')
          .eql(true);
        done();
      });
  });
});


describe('/POST MENU', () => {
  it("it should'nt allow a user without token access this route", (done) => {
    const menu = {
      description: 'The Big Bad Broad and Burdened Bear is here!',
      price: 800,
      menutitle: 'Beans and Yam',
    };
    chai
      .request(app)
      .post('/api/v1/menu')
      .send(menu)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have
          .property('message')
          .eql('Forbidden!,valid token needed to access route');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow a invalid input fields", (done) => {
    const order = {
      description: '',
      price: 800,
      quantity: 5,
    };
    chai
      .request(app)
      .post('/api/v1/menu')
      .set('Authorization', `Bearer ${Jwt.sign({ userid: 2 }, process.env.JWT_SECRET_ADMIN)}`)
      .send(order)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should create a post with valid credentials', (done) => {
    const user = {
      userid: 5,
    };
    const menu = {
      menutitle: 'Yam and Egg',
      price: 800,
      description: 'The Big Bad Broad and Burdened Bear is here!',
      imageurl: 'https://www.w3schools.com/sql/sql_join_inner.asp',
    };
    chai
      .request(app)
      .post('/api/v1/menu')
      .set('Authorization', `Bearer ${Jwt.sign({ user }, process.env.JWT_SECRET_ADMIN)}`)
      .send(menu)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message').eql('menu was succesfully created');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('menu');
        done();
      });
  });
});

describe('/GET MENU', () => {
  it('it should allow a user without token access this route', (done) => {
    chai
      .request(app)
      .get('/api/v1/menu')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('menu items successfully returned!...');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('menus');
        done();
      });
  });
});


describe('/GET A SPECIFIC ORDER', () => {
  it("it should'nt allow an admin without token access this route", (done) => {
    chai
      .request(app)
      .get('/api/v1/orders/1')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have
          .property('message')
          .eql('Forbidden!,valid token needed to access route');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow a invalid input fields", (done) => {
    chai
      .request(app)
      .get('/api/v1/orders/*')
      .set('Authorization', `Bearer ${Jwt.sign({ adminid: 2 }, process.env.JWT_SECRET_ADMIN)}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message')
          .eql('The order ID must be an integer!...');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should return a response when order doesnt exists', (done) => {
    const admin = {
      adminid: 3,
    };
    chai
      .request(app)
      .get('/api/v1/orders/3')
      .set('Authorization', `Bearer ${Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN)}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('message').eql('the given order does\'t exits');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should return admin order history given valid credentials', (done) => {
    const admin = {
      adminid: 1,
    };
    chai
      .request(app)
      .get('/api/v1/orders/1')
      .set('Authorization', `Bearer ${Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN)}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message').eql('orders successfully returned!...');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('order');
        done();
      });
  });
});

describe('/POST ORDER', () => {
  it("it should'nt allow a user without token access this route", (done) => {
    const order = {
      myOrders: [{ menuid: 3, quantity: 5 }, { menuid: 1, quantity: 8 }],
    };
    chai
      .request(app)
      .post('/api/v1/orders')
      .send(JSON.stringify(order.myOrders))
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have
          .property('message')
          .eql('Forbidden!,valid token needed to access route');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow a invalid input fields", (done) => {
    const order = {
      myOrders: [{ menuid: 3, quantity: 5 }, { menuid: 1, quantity: 8 }],
    };
    chai
      .request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ userid: 2 }, process.env.JWT_SECRET)}`)
      .send(JSON.stringify(order.myOrders))
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it shouldn\'t create a post with invalid menuid', (done) => {
    const user = {
      userid: 2,
    };
    const order = {
      myOrders: [{ menuid: 100, quantity: 5 }, { menuid: 1, quantity: 8 }],
    };
    chai
      .request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ user }, process.env.JWT_SECRET)}`)
      .send(order)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should create a post with valid credentials', (done) => {
    const user = {
      userid: 2,
    };
    const order = {
      myOrders: [{ menuid: 1, quantity: 5 }, { menuid: 1, quantity: 8 }],
    };
    chai
      .request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ user }, process.env.JWT_SECRET)}`)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message').eql('order was succesfully created');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('data');
        done();
      });
  });
});

describe('/GET ORDER HISTORY', () => {
  it("it should'nt allow a user without token access this route", (done) => {
    chai
      .request(app)
      .get('/api/v1/users/3/orders')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have
          .property('message')
          .eql('Forbidden!,valid token needed to access route');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow a invalid input fields", (done) => {
    chai
      .request(app)
      .get('/api/v1/users/*/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ userid: 2 }, process.env.JWT_SECRET)}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message')
          .eql('orderId must be an integer');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should return user order history given valid credentials', (done) => {
    const user = {
      userid: 3,
    };
    chai
      .request(app)
      .get('/api/v1/users/3/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ user }, process.env.JWT_SECRET)}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('message').eql('you havent place any order on the platform');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should return user order history given valid credentials', (done) => {
    const user = {
      userid: 1,
    };
    chai
      .request(app)
      .get('/api/v1/users/1/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ user }, process.env.JWT_SECRET)}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message').eql('orders was successfully returned! ....');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('orders');
        done();
      });
  });
});

describe('/GET ALL ORDERS ', () => {
  it('it should allow a user without token access this route', (done) => {
    const admin = {
      userid: 1,
    };
    chai
      .request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN)}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('orders successfully returned!...');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('orders');
        done();
      });
  });
});

describe('/PUT ORDER STATUS', () => {
  it("it should'nt allow a user without token access this route", (done) => {
    const stat = {
      status: 'new',
    };
    chai
      .request(app)
      .put('/api/v1/orders/1')
      .send(stat)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have
          .property('message')
          .eql('Forbidden!,valid token needed to access route');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it("it should'nt allow a invalid input fields", (done) => {
    const stat = {
      status: 'lonocious',
    };
    chai
      .request(app)
      .put('/api/v1/orders/1')
      .set('Authorization', `Bearer ${Jwt.sign({ adminid: 2 }, process.env.JWT_SECRET_ADMIN)}`)
      .send(stat)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });

  it('it should update status given valid credentials', (done) => {
    const admin = {
      adminid: 1,
    };
    const stat = {
      status: 'processing',
    };
    chai
      .request(app)
      .put('/api/v1/orders/1')
      .set('Authorization', `Bearer ${Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN)}`)
      .send(stat)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message').eql('order status was successfully updated');
        res.body.should.have
          .property('success')
          .eql(true);
        res.body.should.have
          .property('order');
        done();
      });
  });

  it('it shouldn\'t update status when order ID isn\'t in the database', (done) => {
    const admin = {
      adminid: 1,
    };
    const stat = {
      status: 'processing',
    };
    chai
      .request(app)
      .put('/api/v1/orders/5')
      .set('Authorization', `Bearer ${Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN)}`)
      .send(stat)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('message').eql('The given order doesn\'t exist in the database');
        res.body.should.have
          .property('success')
          .eql(false);
        done();
      });
  });
});
