const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;

const AUTH = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NzY5NjMxNX0.p-6LrQzZHg4tEckg3-HlI8ENHT6SQSsfFN8CElCLYSc"

describe("DELETE /users/{userId}", () =>{
    const userId = "45cfe8ce-b2be-49b7-9842-a43ff0a1c281";
    const userId_not_exist = "99cfe8ce-b2be-49b7-9842-a43ff0a1c999";

    it("Positive - Verify response properties", async function(){
        const response = await request
                                .delete(`/users/${userId}`)
                                .set({
                                    Authorization: AUTH
                                });

        expect(await response.body).to.have.property("status").that.is.a("string");
        expect(await response.body).to.have.property("message").that.is.a("string");
    });

    it("Positive - delete user", async function(){
        const response = await request
                                .delete(`/users/${userId}`)
                                .set({
                                    Authorization: AUTH
                                });
        
        // console.log(response);
        expect(await response.statusCode).to.eql(200);
        expect(await response.body.status).to.eql("success");
        expect(await response.body.message).to.eql("User berhasil dihapus");
    });

    it("Negative - delete user without token", async function(){
        const response = await request
                                .delete(`/users/${userId}`)

        expect(await response.status).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("authentication");
    });

    it("Negative - delete user using expired token", async function(){
        const AUTH_EXP = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2Y2MDk5LThmYjgtNDA5NC04MTAzLTIyZTM3YzljYTY3OCIsImNvbXBhbnlJZCI6IjBiZTM3YzJmLTU0YzEtNDc2MC04MGZmLWZjZDNhOGUxN2Y1OCIsImlhdCI6MTY4NjQ0NjkyNH0.NVSKlVfI4Jn8JyBsr25bJtD6R9Cmv63XhhTGNpX1Eqc";

        const response = await request
                                .delete(`/users/${userId}`)
                                .set({Authorization: AUTH_EXP});

        expect(await response.status).to.eql(401);
        expect(await response.body.error).to.eql("Unauthorized");
        expect(await response.body.message).to.include("Token maximum age exceeded");
    });

    it("Negative - delete not exist userId", async function(){
        const response = await request
                                .delete(`/users/${userId_not_exist}`)
                                .set({Authorization: AUTH});

        expect(await response.statusCode).to.eql(200);
        expect(await response.body.status).to.eql("success");
        expect(await response.body.message).to.eql("User berhasil dihapus");
    });
});