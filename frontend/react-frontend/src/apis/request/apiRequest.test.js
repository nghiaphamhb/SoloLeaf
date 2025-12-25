// Unit tests for apiRequest helper (mocking fetch)

import { apiRequest } from "./apiRequest";

describe("apiRequest", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("attaches Content-Type and merges custom headers", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    });

    await apiRequest("/x", { method: "GET", headers: { "X-Test": "1" } });

    const [, options] = fetch.mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers["X-Test"]).toBe("1");
  });

  test("attaches Authorization when token exists", async () => {
    localStorage.setItem("token", "abc");

    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    });

    await apiRequest("/x", { method: "GET" });

    const [, options] = fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc");
  });

  test("throws Unauthorized and removes token on 401", async () => {
    localStorage.setItem("token", "abc");

    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ message: "nope" }),
    });

    await expect(apiRequest("/x", { method: "GET" })).rejects.toThrow("Unauthorized");
    expect(localStorage.getItem("token")).toBeNull();
  });

  test("throws Unauthorized and removes token on 403", async () => {
    localStorage.setItem("token", "abc");

    fetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => JSON.stringify({ message: "forbidden" }),
    });

    await expect(apiRequest("/x", { method: "GET" })).rejects.toThrow("Unauthorized");
    expect(localStorage.getItem("token")).toBeNull();
  });

  test("parses JSON response when body is JSON", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ a: 1 }),
    });

    const data = await apiRequest("/x", { method: "GET" });
    expect(data).toEqual({ a: 1 });
  });

  test("returns null when response body is empty", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "",
    });

    const data = await apiRequest("/x", { method: "GET" });
    expect(data).toBeNull();
  });

  test("returns raw text when response is not JSON", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "OK",
    });

    const data = await apiRequest("/x", { method: "GET" });
    expect(data).toBe("OK");
  });

  test("throws error with message from JSON body when !ok", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: "Boom" }),
    });

    await expect(apiRequest("/x", { method: "GET" })).rejects.toMatchObject({
      message: "Boom",
      status: 500,
      data: { message: "Boom" },
    });
  });

  test("throws error with default message when !ok and no message in body", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ error: "Not found" }),
    });

    await expect(apiRequest("/x", { method: "GET" })).rejects.toMatchObject({
      message: "Request failed (404)",
      status: 404,
    });
  });
});
