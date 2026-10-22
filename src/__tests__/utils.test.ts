import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  formatRelativeTime,
  getInitials,
  slugify,
  truncate,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names and handles conditional classes", () => {
      expect(cn("px-4 py-2", true && "bg-primary", false && "hidden")).toBe(
        "px-4 py-2 bg-primary"
      );
    });

    it("handles Tailwind class conflicts with twMerge", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });
  });

  describe("getInitials", () => {
    it("extracts up to 2 uppercase initials", () => {
      expect(getInitials("Marcus Vance")).toBe("MV");
      expect(getInitials("Sarah")).toBe("S");
      expect(getInitials("John Robert Smith")).toBe("JR");
    });
  });

  describe("slugify", () => {
    it("converts strings to URL-friendly slugs", () => {
      expect(slugify("Electrical Panel Upgrade")).toBe("electrical-panel-upgrade");
      expect(slugify("HVAC & Heating Systems")).toBe("hvac-heating-systems");
      expect(slugify("  Special   Characters!@#  ")).toBe("special-characters");
    });
  });

  describe("truncate", () => {
    it("truncates strings exceeding max length with an ellipsis", () => {
      expect(truncate("Hello World", 5)).toBe("Hello…");
      expect(truncate("Short", 10)).toBe("Short");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date strings nicely", () => {
      const date = "2024-01-15T00:00:00Z";
      const formatted = formatDate(date);
      expect(formatted).toContain("2024");
      expect(formatted).toContain("Jan");
    });
  });

  describe("formatRelativeTime", () => {
    it("returns formatted relative time string", () => {
      const past = new Date(Date.now() - 60000).toISOString();
      const relative = formatRelativeTime(past);
      expect(typeof relative).toBe("string");
      expect(relative.length).toBeGreaterThan(0);
    });
  });
});
