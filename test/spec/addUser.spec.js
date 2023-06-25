const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;

const AUTH = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NzY5MDE4OX0.u5x-i_rwxWrQ2_SLLWANDIhLzvnEfVfjYUhBoVnHnnA"

describe("POST /users", () =>{
    var bodyReq = {
        "name": "kasir-alif",
        "email": "kasir-alif@gmail.com",
        "password": "123456"
    };

    it("Positive - Verify response properties", async function(){
        const response = await request
                                .post('/users')
                                .send(bodyReq)
                                .set({
                                    Authorization: AUTH
                                });

        expect(await response.body).to.have.property("status").that.is.a("string");
        expect(await response.body).to.have.property("message").that.is.a("string");
        expect(await response.body).to.have.property("data").that.is.an("object").that.has.all.keys("userId","name");
    });

    it("Positive - create new user", async function(){
        const response = await request
                                .post('/users')
                                .send(bodyReq)
                                .set({
                                    Authorization: AUTH
                                });
        
        // console.log(response);
        expect(await response.statusCode).to.eql(201);
        expect(await response.body.status).to.eql("success");
        expect(await response.body.data.name).to.eql(bodyReq.name);
    });

    it("Negative - create user without token", async function(){
        const response = await request
                                .post('/users')
                                .send(bodyReq);

        expect(await response.statusCode).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("authentication");
    });

    it("Negative - create user using expired token", async function(){
        const AUTH_EXP = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NjQ0NjkyNH0.NVSKlVfI4Jn8JyBsr25bJtD6R9Cmv63XhhTGNpX1Eqc";

        const response = await request
                                .post('/users')
                                .send(bodyReq)
                                .set({Authorization: AUTH_EXP});

        expect(await response.status).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("Token maximum age exceeded");
    });
});