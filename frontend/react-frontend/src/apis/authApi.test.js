// src/apis/authApi.test.js
// Unit tests for authApi wrappers by mocking apiRequest

jest.mock("./request/apiRequest.js", () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from "./request/apiRequest.js";
import { loginApi, registerApi } from "./authApi.js";

describe("authApi", () => {
  beforeEach(() => {
    apiRequest.mockReset();
  });

  test("loginApi calls /api/auth/login with POST and json body", async () => {
    apiRequest.mockResolvedValue({ token: "t" });

    const res = await loginApi({ email: "a@a.com", password: "123" });

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@a.com", password: "123" }),
    });
    expect(res).toEqual({ token: "t" });
  });

  test("registerApi calls /api/auth/register with default roleId=2", async () => {
    apiRequest.mockResolvedValue({ ok: true });

    await registerApi({ fullname: "A", email: "a@a.com", password: "123" });

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullname: "A", email: "a@a.com", password: "123", roleId: 2 }),
    });
  });

  test("registerApi passes custom roleId", async () => {
    apiRequest.mockResolvedValue({ ok: true });

    await registerApi({ fullname: "A", email: "a@a.com", password: "123", roleId: 1 });

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullname: "A", email: "a@a.com", password: "123", roleId: 1 }),
    });
  });
});
