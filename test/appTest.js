import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const should = chai.should();

chai.use(chaiHttp);
  describe("/SIGNUP", () => {
    it("it should allow a user signup with  valid credentials", done => {
      const signup = {
        username: "tunde",
        password: "tunde@tunde",
        email:'tunde@tunde.com',
        address: '4 Napier Garden Lekki Lagos',
        phone: '0810 954 8778'
      };
      chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send(signup)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eql("user account successfully created!....");
            res.body.should.have
            .property("success")
            .eql(true);
          res.body.should.have.property("token");
          res.body.should.have.property("details");
          done();
        });
    });

     it("it should'nt allow a user signup with the same credentials twice", done => {
      const signup = {
        username: "tunde",
        password: "tunde@tunde",
        email:'tunde@tunde.com',
        address: '4 Napier Garden Lekki Lagos',
        phone: '0810 954 8778'
      };
      chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send(signup)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have
            .property("message")
            .eql("user with credentials already exits");
            res.body.should.have
            .property("success")
            .eql(false);
          done();
        });
    });


     it("it should'nt allow improper input fileds", done => {
     const signup = {
        username: "tunde",
        password: "",
        email:'tunde@tunde.com',
        address: '4 Napier Garden Lekki Lagos',
        phone: '0810 954 8778'
      };
      chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send(signup)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have
            .property("message");
            res.body.should.have
            .property("success")
            .eql(false);
          done();
        });
    });
  });


describe("/SIGNOUT", () => {
    it("it should allow a user to signout of the app", done => {
      chai
        .request(app)
        .get("/api/v1/signout")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eql("you have successfully signed out");
            res.body.should.have
            .property("success")
            .eql(true);
          done();
        });
    });
  });
