const request = require('supertest')("https://kasir-api.belajarqa.com"); // import supertest
const expect = require("chai").expect; // import chai

const AUTH = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NzY5MDE4OX0.u5x-i_rwxWrQ2_SLLWANDIhLzvnEfVfjYUhBoVnHnnA";

describe("GET /users/{userId}", () =>{
    const userId = "45cfe8ce-b2be-49b7-9842-a43ff0a1c281";
    const userId_not_exist = "45cfe8ce-b2be-49b7-9842-a43ff0a1c999";

    it("Positive - Verify response properties", async function(){
        const response = await request
                                .get(`/users/${userId}`)
                                .set({
                                    Authorization: AUTH
                                });

        // console.log(response)
        expect(await response.body).to.have.property("status").that.is.a("string");
        expect(await response.body).to.have.property("data").that.is.an("object").that.has.all.keys("user");
        expect(await response.body.data.user).to.has.all.keys("id","name","email","role");
    });

    it("Positive - get user detail", async function(){
        
        const response = await request
                                .get(`/users/${userId}`)
                                .set({
                                    Authorization: AUTH
                                });

        expect(await response.status).to.equal(200);

    });

    it("Negative - get detail user using expired token", async function(){
        const AUTH_EXP = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NjQ0NjkyNH0.NVSKlVfI4Jn8JyBsr25bJtD6R9Cmv63XhhTGNpX1Eqc";

        const response = await request
                                .get(`/users/${userId}`)
                                .set({Authorization: AUTH_EXP});

        expect(await response.status).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("Token maximum age exceeded");
    });

    it("Negative - get detail user not existed", async function(){
        const response = await request
                                .get(`/users/${userId_not_exist}`)
                                .set({Authorization: AUTH});

        expect(await response.status).to.eql(404);
        expect(await response.body.message).to.include("User tidak ditemukan");
    });
})
