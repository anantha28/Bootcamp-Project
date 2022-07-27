let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = "http://localhost:8080";
let should = chai.should();

chai.use(chaiHttp);


//==============Testing Login==========================

var login_rec_error={username:"mill",password:"mil"}
describe('/POST login(ERROR)', () => {
    it('should not be able to login', (done) => {
      chai.request(server)
          .post('/login')
          .send(login_rec_error)
          .end((err, res) => {
                console.log(res.status);
                //console.log(login_rec_error)
                //res.text.should.be.eql('');
                res.body.message.should.be.eql('error');
                res.should.have.status(401);
                // res.body.should.be.a('array');
                //res.body.length.should.be.eql(0);
            done();
          });
    });
});

var login_rec={username:"mill",password:"mill"}
describe('/POST login', () => {
    it('should be able to login', (done) => {
      chai.request(server)
          .post('/login')
          .send(login_rec)
          .end((err, res) => {
                console.log(res.status);
                res.text.should.be.eql('mill');
                 res.should.have.status(200);
                // res.body.should.be.a('array');
                //res.body.length.should.be.eql(0);
            done();
          });
    });
});

//===========================================================

//=====================testing Register route==================

// var register_cred={username:"new_rec1",password:"pwd"}

// describe('/POST Register', () => {
//     it('should be able to register new credentials', (done) => {
//       chai.request(server)
//           .post('/register')
//           .send(register_cred)
//           .end((err, res) => {
//                 console.log(res.status);
//                 res.body.message.should.be.eql('Registration Successful')
//                  res.should.have.status(201);
//                 // res.body.should.be.a('array');
//                 //res.body.length.should.be.eql(0);
//             done();
//           });
//     });
// });


var register_cred_error={username:"mill",password:"mil"}
describe('/POST Register (ERROR)', () => {
    it('should not be able to register', (done) => {
      chai.request(server)
          .post('/register')
          .send(register_cred_error)
          .end((err, res) => {
                console.log(res.status);
                res.body.error.should.be.eql('User Exists')
                res.should.have.status(422);
            done();
          });
    });
});

//=========================================================================

//=====================testing Subcriptions==================

var username={username:"aaa"};
  describe('/POST: all admin forms', () => {
      it('should get all the subscriptions', (done) => {
        chai.request(server)
            .post('/adminForms')
            .send(username)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  //=====================test Configuring Feedback Form==================

  var config = {
    eventDetailsAr: [{productName: "salesforce", event: "buy"}],
    username: "aaa",
    questions: [],
    cadence: 30,
};

  describe('/POST configureForm', () => {
      it('should be able to configure new form', (done) => {
        chai.request(server)
            .post('/configureForm')
            .send(config)
            .end((err, res) => {
                  res.should.have.status(200);
                  //console.log(res.body)
                  //console.log(res.body);
                  res.body.should.be.a('object');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  
