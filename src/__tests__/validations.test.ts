import { describe, it, expect } from "vitest";
import {
  loginSchema,
  customerRegisterSchema,
  professionalRegisterSchema,
  forgotPasswordSchema,
  createServiceRequestSchema,
} from "@/validations";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("validates valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "Password123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid emails", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "Password123!",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short passwords (< 8 chars)", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("customerRegisterSchema", () => {
    it("validates matching passwords with uppercase and number", () => {
      const result = customerRegisterSchema.safeParse({
        full_name: "Sarah Miller",
        email: "sarah@example.com",
        password: "SecurePassword1",
        confirm_password: "SecurePassword1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = customerRegisterSchema.safeParse({
        full_name: "Sarah Miller",
        email: "sarah@example.com",
        password: "SecurePassword1",
        confirm_password: "DifferentPassword2",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });
  });

  describe("professionalRegisterSchema", () => {
    it("requires headline, city, and service area", () => {
      const result = professionalRegisterSchema.safeParse({
        full_name: "Marcus Vance",
        email: "marcus@example.com",
        password: "SecurePassword1",
        confirm_password: "SecurePassword1",
        headline: "Master Electrician",
        city: "Seattle",
        service_area: "Greater Seattle",
      });
      expect(result.success).toBe(true);
    });

    it("fails when headline is missing or too short", () => {
      const result = professionalRegisterSchema.safeParse({
        full_name: "Marcus Vance",
        email: "marcus@example.com",
        password: "SecurePassword1",
        confirm_password: "SecurePassword1",
        headline: "Hi",
        city: "Seattle",
        service_area: "Greater Seattle",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createServiceRequestSchema", () => {
    it("validates correct service request fields", () => {
      const result = createServiceRequestSchema.safeParse({
        professional_id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Kitchen Sink Leak",
        description: "Need fixing for a steady pipe drip under the sink that is getting worse.",
        location: "Seattle, WA",
        budget: 250,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing title or description", () => {
      const result = createServiceRequestSchema.safeParse({
        location: "Seattle, WA",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("validates proper email address", () => {
      const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email address", () => {
      const result = forgotPasswordSchema.safeParse({ email: "invalid-email" });
      expect(result.success).toBe(false);
    });
  });
});
