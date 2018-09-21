import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const should = chai.should();

chai.use(chaiHttp);