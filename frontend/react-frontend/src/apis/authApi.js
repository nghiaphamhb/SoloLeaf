import { apiRequest} from "./request/apiRequest.js";

export async function loginApi({email, password}) {
    return await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function registerApi({ fullname, email, password, roleId = 2 }) {
    return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullname, email, password, roleId }),
    });
}