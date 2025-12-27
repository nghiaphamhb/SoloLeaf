/**
 * @jest-environment jsdom
 */

import { apiRequest } from "./apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";

// ---- Mocks ----
jest.mock("../../bugsnag/bugsnag.js", () => ({
  notify: jest.fn(),
}));

describe("apiRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /* =========================
     SUCCESS CASES
     ========================= */

  test("should make GET request and return parsed JSON", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ hello: "world" }),
    });

    const res = await apiRequest("/api/test");

    expect(fetch).toHaveBeenCalledWith("/api/test", {
      headers: { "Content-Type": "application/json" },
    });

    expect(res).toEqual({ hello: "world" });
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  test("should attach Authorization header if token exists", async () => {
    localStorage.getItem.mockReturnValue("TOKEN123");

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    });

    await apiRequest("/api/secure");

    expect(fetch).toHaveBeenCalledWith(
      "/api/secure",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer TOKEN123",
        }),
      })
    );
  });

  test("should return null if response body is empty", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      text: async () => "",
    });

    const res = await apiRequest("/api/empty");

    expect(res).toBeNull();
  });

  test("should return raw text if response is not valid JSON", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => "PLAIN_TEXT",
    });

    const res = await apiRequest("/api/text");

    expect(res).toBe("PLAIN_TEXT");
  });

  /* =========================
     AUTH FAILURE
     ========================= */

  test("should remove token and notify Bugsnag on 401", async () => {
    localStorage.getItem.mockReturnValue("TOKEN");

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ message: "Unauthorized" }),
    });

    const res = await apiRequest("/api/private");

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(Bugsnag.notify).toHaveBeenCalledTimes(2);
    // 1x Unauthorized, 1x Request failed
    expect(res).toEqual({ message: "Unauthorized" });
  });

  test("should remove token and notify Bugsnag on 403", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => "",
    });

    const res = await apiRequest("/api/forbidden");

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(Bugsnag.notify).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  /* =========================
     NON-OK RESPONSE
     ========================= */

  test("should notify Bugsnag when response is not ok and return parsed body", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: "Server error" }),
    });

    const res = await apiRequest("/api/error");

    expect(Bugsnag.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Server error",
        status: 500,
      })
    );

    expect(res).toEqual({ message: "Server error" });
  });

  test("should notify Bugsnag with default message when body has no message", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({}),
    });

    const res = await apiRequest("/api/not-found");

    expect(Bugsnag.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Request failed (404)",
        status: 404,
      })
    );

    expect(res).toEqual({});
  });
});
