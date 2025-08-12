import { NextRequest } from "next/server";
import { POST } from "../contact/route";
import {
  TestDatabaseUtils,
  MockDataGenerators,
} from "@/lib/test-utils/db-test-utils";

// Mock email service
jest.mock("@/lib/email-service", () => ({
  sendContactEmail: jest.fn(),
  sendAutoReply: jest.fn(),
}));

// Mock rate limiting
jest.mock("@/lib/rate-limit", () => ({
  rateLimit: jest.fn(),
}));

// Mock database
jest.mock("@/lib/db", () => ({
  db: {
    contactSubmission: {
      create: jest.fn(),
    },
  },
}));

import { sendContactEmail, sendAutoReply } from "@/lib/email-service";
import { rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";

const mockSendContactEmail = sendContactEmail as jest.MockedFunction<
  typeof sendContactEmail
>;
const mockSendAutoReply = sendAutoReply as jest.MockedFunction<
  typeof sendAutoReply
>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const mockDb = db as jest.Mocked<typeof db>;

describe("/api/contact", () => {
  beforeAll(async () => {
    await TestDatabaseUtils.setup();
  });

  afterAll(async () => {
    await TestDatabaseUtils.teardown();
  });

  beforeEach(async () => {
    await TestDatabaseUtils.reset();
    jest.clearAllMocks();

    // Default rate limit to allow requests
    mockRateLimit.mockResolvedValue({ success: true });
  });

  describe("POST /api/contact", () => {
    const validContactData = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Project Inquiry",
      message: "I would like to discuss a project with you.",
      type: "PROJECT_INQUIRY",
    };

    it("successfully submits contact form", async () => {
      const mockSubmission =
        MockDataGenerators.generateContactSubmission(validContactData);
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockResolvedValue({ success: true, id: "email-1" });
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Message sent successfully");

      expect(mockDb.contactSubmission.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          subject: "Project Inquiry",
          message: "I would like to discuss a project with you.",
          type: "PROJECT_INQUIRY",
        }),
      });
    });

    it("sends notification and auto-reply emails", async () => {
      const mockSubmission =
        MockDataGenerators.generateContactSubmission(validContactData);
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockResolvedValue({ success: true, id: "email-1" });
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
      });

      await POST(request);

      expect(mockSendContactEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        subject: "Project Inquiry",
        message: "I would like to discuss a project with you.",
        type: "PROJECT_INQUIRY",
      });

      expect(mockSendAutoReply).toHaveBeenCalledWith({
        to: "john@example.com",
        name: "John Doe",
        type: "PROJECT_INQUIRY",
      });
    });

    it("validates required fields", async () => {
      const invalidData = {
        name: "",
        email: "invalid-email",
        message: "",
      };

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "name" }),
          expect.objectContaining({ field: "email" }),
          expect.objectContaining({ field: "message" }),
        ])
      );
    });

    it("validates email format", async () => {
      const invalidEmailData = {
        ...validContactData,
        email: "not-an-email",
      };

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(invalidEmailData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "email",
            message: expect.stringContaining("valid email"),
          }),
        ])
      );
    });

    it("validates message length", async () => {
      const shortMessageData = {
        ...validContactData,
        message: "Hi",
      };

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(shortMessageData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "message",
            message: expect.stringContaining("10 characters"),
          }),
        ])
      );
    });

    it("handles rate limiting", async () => {
      mockRateLimit.mockResolvedValue({
        success: false,
        error: "Too many requests",
        retryAfter: 60,
      });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Too many requests");
      expect(response.headers.get("Retry-After")).toBe("60");
    });

    it("handles project inquiry with additional fields", async () => {
      const projectInquiryData = {
        ...validContactData,
        type: "PROJECT_INQUIRY",
        projectType: "E-commerce Website",
        budget: "$10,000 - $25,000",
        timeline: "3-4 months",
      };

      const mockSubmission =
        MockDataGenerators.generateContactSubmission(projectInquiryData);
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockResolvedValue({ success: true, id: "email-1" });
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(projectInquiryData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      expect(mockDb.contactSubmission.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          projectType: "E-commerce Website",
          budget: "$10,000 - $25,000",
          timeline: "3-4 months",
        }),
      });
    });

    it("sanitizes input to prevent XSS", async () => {
      const maliciousData = {
        name: "<script>alert('xss')</script>John",
        email: "john@example.com",
        subject: "<img src=x onerror=alert('xss')>Subject",
        message: "Normal message content",
      };

      const mockSubmission = MockDataGenerators.generateContactSubmission();
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockResolvedValue({ success: true, id: "email-1" });
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(maliciousData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);

      // Verify that malicious scripts are sanitized
      const createCall = mockDb.contactSubmission.create.mock.calls[0][0];
      expect(createCall.data.name).not.toContain("<script>");
      expect(createCall.data.subject).not.toContain("<img");
    });

    it("handles database errors gracefully", async () => {
      mockDb.contactSubmission.create.mockRejectedValue(
        new Error("Database error")
      );

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to submit contact form");
    });

    it("handles email service failures gracefully", async () => {
      const mockSubmission =
        MockDataGenerators.generateContactSubmission(validContactData);
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockRejectedValue(new Error("Email service error"));
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still succeed even if notification email fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Message sent successfully");
    });

    it("handles consultation booking type", async () => {
      const consultationData = {
        ...validContactData,
        type: "CONSULTATION",
        message: "I would like to schedule a consultation call.",
      };

      const mockSubmission =
        MockDataGenerators.generateContactSubmission(consultationData);
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockResolvedValue({ success: true, id: "email-1" });
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(consultationData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      expect(mockSendAutoReply).toHaveBeenCalledWith({
        to: "john@example.com",
        name: "John Doe",
        type: "CONSULTATION",
      });
    });

    it("handles missing Content-Type header", async () => {
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
        // No Content-Type header
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still work without explicit Content-Type
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("handles malformed JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: "invalid json{",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid JSON");
    });

    it("logs contact submissions for analytics", async () => {
      const mockSubmission =
        MockDataGenerators.generateContactSubmission(validContactData);
      mockDb.contactSubmission.create.mockResolvedValue(mockSubmission);
      mockSendContactEmail.mockResolvedValue({ success: true, id: "email-1" });
      mockSendAutoReply.mockResolvedValue({ success: true, id: "email-2" });

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Contact form submitted"),
        expect.objectContaining({
          type: "PROJECT_INQUIRY",
          email: "john@example.com",
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
