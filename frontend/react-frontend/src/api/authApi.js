export async function loginApi({email, password}) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if(!res.ok) {
        const text = await res.text();
        throw new Error("Login failed: " + text);
    }
    return res.json();
}

export async function registerApi({ fullname, email, password, roleId }) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password, roleId }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Register failed: " + text);
    }
    return res.json();
}