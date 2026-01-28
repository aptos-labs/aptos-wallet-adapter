import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../../src/utils/logger";

describe("logger", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe("in development environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("log should call console.log in development", () => {
      logger.log("test message");
      expect(console.log).toHaveBeenCalledWith("test message");
    });

    it("log should pass multiple arguments", () => {
      logger.log("message", { data: "value" }, 123);
      expect(console.log).toHaveBeenCalledWith(
        "message",
        { data: "value" },
        123
      );
    });

    it("warn should call console.warn in development", () => {
      logger.warn("warning message");
      expect(console.warn).toHaveBeenCalledWith("warning message");
    });

    it("error should call console.error in development", () => {
      logger.error("error message");
      expect(console.error).toHaveBeenCalledWith("error message");
    });
  });

  describe("in production environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    it("log should not call console.log in production", () => {
      logger.log("test message");
      expect(console.log).not.toHaveBeenCalled();
    });

    it("warn should not call console.warn in production", () => {
      logger.warn("warning message");
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("error should not call console.error in production", () => {
      logger.error("error message");
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe("in test environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "test";
    });

    it("log should not call console.log in test", () => {
      logger.log("test message");
      expect(console.log).not.toHaveBeenCalled();
    });

    it("warn should not call console.warn in test", () => {
      logger.warn("warning message");
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("error should not call console.error in test", () => {
      logger.error("error message");
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});

