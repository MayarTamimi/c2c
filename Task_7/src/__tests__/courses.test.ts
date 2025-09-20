import {
  api,
  generateAuthToken,
  createFakeCoursePayload,
} from "./helpers/supertest.helper";
import { faker } from "@faker-js/faker";

describe("POST/courses", () => {
  it("should create a course", async () => {
    const payload = createFakeCoursePayload();

    const res = await api
      .post("/courses")
      .set("Authorization", generateAuthToken("ADMIN"))
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(payload.title);
  });
});

describe("GET/courses", () => {
  it("should return all courses we have", async () => {
    const res = await api.get("/courses");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET/courses/:id", () => {
  it("should return course details when ID is valid", async () => {
    const createRes = await api
      .post("/courses")
      .set("Authorization", generateAuthToken("COACH"))
      .send(createFakeCoursePayload());

    const courseId = createRes.body.id;

    const res = await api.get(`/courses/${courseId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", courseId);
    expect(res.body).toHaveProperty("title");
  });
});

describe("PUT/courses/:id", () => {
  let coachToken: string;
  let studentToken: string;
  let courseId: string;

  beforeAll(async () => {
    coachToken = generateAuthToken("COACH");
    studentToken = generateAuthToken("STUDENT");

    const createRes = await api
      .post("/courses")
      .set("Authorization", coachToken)
      .send(createFakeCoursePayload());

    courseId = createRes.body.id;
  });

  it("should allow coach to update their course", async () => {
    const updatedData = {
      title: "new course title",
      description: "new course description",
      image: faker.internet.url(),
      price: 100,
    };

    const updatedRes = await api
      .put(`/courses/${courseId}`)
      .set("Authorization", coachToken)
      .send(updatedData);

    expect(updatedRes.statusCode).toBe(200);
    expect(updatedRes.body).toHaveProperty("id", courseId);
    expect(updatedRes.body).toHaveProperty("title", updatedData.title);
    expect(updatedRes.body).toHaveProperty(
      "description",
      updatedData.description
    );
    expect(updatedRes.body).toHaveProperty("image", updatedData.image);
  });

  it("should NOT allow student to update a course", async () => {
    const updatedData = {
      title: "student update attempt",
      description: "should fail",
      image: faker.internet.url(),
      price: 50,
    };

    const updateRes = await api
      .put(`/courses/${courseId}`)
      .set("Authorization", studentToken)
      .send(updatedData);

    expect(updateRes.statusCode).toBe(403);
  });
});

describe("DELETE /courses/:id", () => {
  let coachToken: string;
  let otherCoachToken: string;
  let adminToken: string;
  let studentToken: string;
  let courseId: string;

  beforeAll(async () => {
    coachToken = generateAuthToken("COACH");
    otherCoachToken = generateAuthToken("COACH", { sub: "other-coach-id" }); // different coach ID
    adminToken = generateAuthToken("ADMIN");
    studentToken = generateAuthToken("STUDENT");

    // Create a course as the first coach, save id
    const res = await api
      .post("/courses")
      .set("Authorization", coachToken)
      .send(createFakeCoursePayload());

    courseId = res.body.id;
  });

  it("should allow course creator COACH to delete their course", async () => {
    const res = await api
      .delete(`/courses/${courseId}`)
      .set("Authorization", coachToken);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should allow ADMIN to delete any course", async () => {
    const resCreate = await api
      .post("/courses")
      .set("Authorization", coachToken)
      .send(createFakeCoursePayload());

    const newCourseId = resCreate.body.id;

    const res = await api
      .delete(`/courses/${newCourseId}`)
      .set("Authorization", adminToken);

    expect(res.statusCode).toBe(200);
  });

  it("should forbid STUDENT from deleting any course", async () => {
    const resCreate = await api
      .post("/courses")
      .set("Authorization", coachToken)
      .send(createFakeCoursePayload());

    const newCourseId = resCreate.body.id;

    const res = await api
      .delete(`/courses/${newCourseId}`)
      .set("Authorization", studentToken);

    expect(res.statusCode).toBe(403);
  });

  it("should forbid COACH from deleting course created by another COACH", async () => {
    const resCreate = await api
      .post("/courses")
      .set("Authorization", coachToken)
      .send(createFakeCoursePayload());

    const newCourseId = resCreate.body.id;

    const res = await api
      .delete(`/courses/${newCourseId}`)
      .set("Authorization", otherCoachToken);

    expect(res.statusCode).toBe(403);
  });
});
