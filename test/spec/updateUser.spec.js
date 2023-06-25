const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;

const AUTH = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NzY5MDE4OX0.u5x-i_rwxWrQ2_SLLWANDIhLzvnEfVfjYUhBoVnHnnA"

describe("PUT /users/{userId}", () =>{
    const userId = "45cfe8ce-b2be-49b7-9842-a43ff0a1c281";
    var bodyReq = {
        "name": "kasir-alif-update",
        "email": "kasir-alif-update@gmail.com"
    };

    it("Positive - Verify response properties", async function(){
        const userId = "45cfe8ce-b2be-49b7-9842-a43ff0a1c281";
        const userId_not_exist = "45cfe8ce-b2be-49b7-9842-a43ff0a1c999";

        const response = await request
                                .put(`/users/${userId}`)
                                .send(bodyReq)
                                .set({
                                    Authorization: AUTH
                                });

        expect(await response.body).to.have.property("status").that.is.a("string");
        expect(await response.body).to.have.property("message").that.is.a("string");
        expect(await response.body).to.have.property("data").that.is.an("object").that.has.all.keys("name");
    });

    it("Positive - update user", async function(){
        const response = await request
                                .put(`/users/${userId}`)
                                .send(bodyReq)
                                .set({
                                    Authorization: AUTH
                                });
        
        // console.log(response);
        expect(await response.statusCode).to.eql(200);
        expect(await response.body.status).to.eql("success");
        expect(await response.body.message).to.eql("User berhasil diupdate");
        expect(await response.body.data.name).to.eql(bodyReq.name);
    });

    it("Negative - update user without token", async function(){
        const response = await request
                                .put(`/users/${userId}`)
                                .send(bodyReq);

        expect(await response.status).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("authentication");
    });

    it("Negative - update user using expired token", async function(){
        const AUTH_EXP = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NjQ0NjkyNH0.NVSKlVfI4Jn8JyBsr25bJtD6R9Cmv63XhhTGNpX1Eqc";

        const response = await request
                                .put(`/users/${userId}`)
                                .send(bodyReq)
                                .set({Authorization: AUTH_EXP});

        expect(await response.status).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("Token maximum age exceeded");
    });

    it("Negative - update user without request body", async function(){
        const userId_not_exist = "99cfe8ce-b2be-49b7-9842-a43ff0a1c999";

        const response = await request
                                .put(`/users/${userId_not_exist}`)
                                .set({Authorization: AUTH});

        expect(await response.status).to.eql(400);
    });
});