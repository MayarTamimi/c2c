export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "COACH" | "STUDENT";
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string; 
  createdAt: Date;
  updatedAt: Date;
}