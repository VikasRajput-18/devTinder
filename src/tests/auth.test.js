const request = require("supertest");
const express = require("express");
const app = require("../app"); // your main app file
const jwt = require("jsonwebtoken");

// Mock middleware (for isolated testing)
// jest.mock("../middleware/auth", () => {
//     return (req, res, next) => {
//         req.user = {
//             id: "123",
//             name: "Test User",
//             email: "test@example.com"
//         };
//         next();
//     };
// });

describe("GET /profile", () => {
    it("should return authenticated user info", async () => {
        const res = await request(app).get("/profile");

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            id: "123",
            name: "Test User",
            email: "test@example.com"
        });
    });
});
