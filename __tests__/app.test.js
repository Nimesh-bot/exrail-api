const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require('dotenv').config({ path: '../.env' });

const db_password = process.env.MONGO_PASSWORD;

let token = '';

beforeAll(async () => {
  const response = await request(app).post('/api/auth/login').send({
    email: 'somit409@gmail.com',
    password: 'Password111@',
  });
  token = response.body.access;
});

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(`mongodb+srv://saqyeah:${db_password}@storage.wkdfkew.mongodb.net/exrailTestServer?retryWrites=true&w=majority`)
});
  
/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

describe("Login User", () => {
    it("should login a user", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "nimesh.ffxiv@gmail.com",
            password: "Password222@",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("access");
    });
});

describe("Expenses", () => {
    it("should get current expenses of user", async () => {
        const res = await request(app).get("/api/expenses/defexpense").set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("expense");
        expect(res.body.expense[0].month).toBe(3);
    });

    it("should update food expenses of user", async () => {
        const res = await request(app).put(`/api/expenses/63faeab482e34ed09e9c3a25`).
        set('Authorization', `${token}`).
        send({
            food: 10,
            transport: 0,
            expected: 0,
            uncertain: 0
        });
        expect(res.statusCode).toEqual(200);
    });

    it("should update estimated expenses of user", async() => {
        const res = await request(app).put(`/api/expenses/estimated/63faeab482e34ed09e9c3a25`).
        set('Authorization', `${token}`).
        send({
            estimated_food: 5000,
            estimated_transport: 1000,
            estimated_expected: 4000
        });
        expect(res.statusCode).toEqual(200);
    })
});

describe("Income", () => {
    it("should get income of user", async () => {
        const res = await request(app).get("/api/income/").set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("income");
    });
    it("should update income of user", async () => {
        const res = await request(app).put("/api/income/").set('Authorization', `${token}`).send({
            monthlySalary: 20000
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.updatedIncome.monthlySalary).toBe(20000);
    });
});         

describe("User", () => {
    it("should get user", async () => {
        const res = await request(app).get("/api/user/").set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.user.email).toBe("somit409@gmail.com");
    });
    it("should add additional income to the balance of user", async () => {
        const res = await request(app).put("/api/user/additional").set('Authorization', `${token}`).send({
            additional: 500
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Additional income added successfully");
    });
    it("should update name of user", async () => {
        const res = await request(app).put("/api/user/info").set('Authorization', `${token}`).send({
            name: "Admin Admin"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("User information updated successfully");
    })
});

describe("Wish", () => {
    it("should get wish of user", async () => {
        const res = await request(app).get("/api/wish/").set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
    });
});