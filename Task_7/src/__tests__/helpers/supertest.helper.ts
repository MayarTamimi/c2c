import jwt from "jsonwebtoken";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "../../server"; 

export const api = request(app);

type Role = "STUDENT" | "ADMIN" | "COACH";

export const generateAuthToken = (
  role: Role,
  options?: { id?: string; sub?: string; [k: string]: any }
): string => {
  const subject = options?.id ?? options?.sub ?? faker.string.uuid();
  const payload = {
    sub: subject,
    role,
  };

  const secret = process.env.JWT_SECRET_KEY || "default_secret";
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return `Bearer ${token}`;
};

export const createFakeCoursePayload = () => ({
  title: faker.lorem.words(3),
  description: faker.lorem.sentences(2),
  image: faker.internet.url(),
  price: faker.number.int({ min: 10, max: 100 }),
});
