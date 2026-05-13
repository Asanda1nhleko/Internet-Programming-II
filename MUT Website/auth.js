console.log("AUTH LOADED");

// ================= LOGIN =================
async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        document.getElementById("msg").innerText = "Fill all fields";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            alert("Login successful ✔");
            window.location.href = "index.html";
        } else {
            document.getElementById("msg").innerText = "Invalid login ❌";
        }

    } catch (err) {
        console.log(err);
        document.getElementById("msg").innerText = "Server error";
    }
}

// ================= REGISTER =================
async function register() {

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !password) {
        alert("Fill all fields");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (data.success) {
            alert("Account created ✔ Now login");
        } else {
            alert("Registration failed ❌");
        }

    } catch (err) {
        console.log(err);
        alert("Server error");
    }
}