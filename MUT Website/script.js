console.log("SCRIPT LOADED SUCCESSFULLY");

// =============================
// SEARCH OPEN / CLOSE
// =============================
function openSearch() {
    document.getElementById("searchModal").style.display = "block";
}

function closeSearch() {
    document.getElementById("searchModal").style.display = "none";
}


// =============================
// CHATBOT LOGIC (MUTI SMART VERSION)
// =============================

console.log("CHATBOT SCRIPT LOADED");

document.addEventListener("DOMContentLoaded", function () {

    const box = document.getElementById("chatbot-box");
    const input = document.getElementById("user-input");
    const messages = document.getElementById("chat-messages");

    if (!box || !input || !messages) {
        console.error("Chatbot elements missing in HTML!");
        return;
    }

    box.style.display = "none";

    window.toggleChat = function () {
        if (box.style.display === "block") {
            box.style.display = "none";
        } else {
            box.style.display = "block";
            showWelcome();
        }
    };

    // 👇 NEW: simple welcome (NO name yet)
    function showWelcome() {
        messages.innerHTML = `
            <div class="bot-msg">👋 Welcome!</div>
            <div class="bot-msg">Say "hi" to start chatting.</div>
        `;
    }

    window.sendMessage = async function () {

        const text = input.value.trim();
        if (!text) return;

        const lowerText = text.toLowerCase();

        messages.innerHTML += `<div class="user-msg">${text}</div>`;
        input.value = "";

        const typingId = "typing";
        messages.innerHTML += `<div class="bot-msg" id="${typingId}">Typing...</div>`;

        // =============================
        // 🧠 GREETING DETECTION (NEW)
        // =============================
        if (
            lowerText === "hi" ||
            lowerText === "hey" ||
            lowerText === "hello"
        ) {
            setTimeout(() => {
                document.getElementById(typingId)?.remove();

                messages.innerHTML += `
                    <div class="bot-msg">
                        👋 Hey! My name is <b>MUTI</b> (Moo-tee), your ICT assistant.<br>
                        How can I help you today?
                    </div>
                `;
            }, 500);

            return; // 🚨 STOP here (no server call)
        }

        try {

            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            document.getElementById(typingId)?.remove();

            messages.innerHTML += `<div class="bot-msg">${data.reply}</div>`;

        } catch (error) {

            console.error("Chat error:", error);

            document.getElementById(typingId)?.remove();

            messages.innerHTML += `<div class="bot-msg">Server not responding. Check backend.</div>`;
        }
    };

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    showWelcome();
});
// =============================
// COOKIE FUNCTION
// =============================
document.addEventListener("DOMContentLoaded", function () {

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    const cookieChoice = localStorage.getItem("cookieChoice");

    // If user already made a choice → hide banner
    if (cookieChoice) {
        banner.style.display = "none";
    }

    // ACCEPT
    acceptBtn.addEventListener("click", function () {
        localStorage.setItem("cookieChoice", "accepted");
        banner.style.display = "none";

        console.log("Cookies accepted");
        // 👉 Enable analytics or other cookies here if you want
    });

    // REJECT
    rejectBtn.addEventListener("click", function () {
        localStorage.setItem("cookieChoice", "rejected");
        banner.style.display = "none";

        console.log("Cookies rejected");
        // 👉 Do NOT run tracking scripts here
    });

});

// =============================
// MAIN LOGIC
// =============================
document.addEventListener("DOMContentLoaded", function () {

    // NAVIGATION
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".dashboard-section");

    navButtons.forEach(button => {
        button.addEventListener("click", function () {

            navButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            sections.forEach(section => section.classList.remove("active"));

            const target = this.getAttribute("data-section");
            const activeSection = document.getElementById(target);

            if (activeSection) {
                activeSection.classList.add("active");
            }
        });
    });

    // ACCORDION
    const accordionButtons = document.querySelectorAll(".accordion");

    accordionButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.classList.toggle("active");

            const panel = this.nextElementSibling;
            if (panel) {
                panel.style.display =
                    (panel.style.display === "block") ? "none" : "block";
            }
        });
    });

    // TABS
    const tabButtons = document.querySelectorAll(".tab-btn");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {

            const parentPanel = this.closest(".panel");
            if (!parentPanel) return;

            parentPanel.querySelectorAll(".tab-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            parentPanel.querySelectorAll(".tab-content").forEach(content => {
                content.classList.remove("active");
            });

            this.classList.add("active");

            const target = this.getAttribute("data-tab");
            const targetContent = parentPanel.querySelector("#" + target);

            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });

    // ENTER KEY CHAT
    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
        chatInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }

    // COOKIE CHECK
    if (localStorage.getItem("cookiesAccepted") === "true") {
        const banner = document.getElementById("cookieBanner");
        if (banner) banner.style.display = "none";
    }

    // SEARCH SYSTEM
    const pages = [
        { name: "Home", link: "index.html" },
        { name: "About", link: "whyus.html" },
        { name: "Courses", link: "courses.html" },
        { name: "Projects", link: "projects.html" },
        { name: "Testimonials", link: "testimonials.html" },
        { name: "Events", link: "events.html" },
        { name: "Contact", link: "contact.html" },
        { name: "Helpdesk", link: "helpdesk.html" },
        { name: "Laboratories", link: "laboratories.html" },
        { name: "FAQ", link: "faq.html" },
        { name: "Feedback", link: "feedback.html" }
    ];

    const input = document.getElementById("modalSearchInput");
    const resultsBox = document.getElementById("modalResults");

    if (input && resultsBox) {

        input.addEventListener("input", function () {

            let query = input.value.toLowerCase();
            resultsBox.innerHTML = "";

            if (query === "") return;

            let filtered = pages.filter(p =>
                p.name.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                resultsBox.innerHTML = "<p>No results found</p>";
                return;
            }

            filtered.forEach(p => {
                let div = document.createElement("div");
                div.classList.add("result-item");
                div.textContent = p.name;

                div.onclick = () => {
                    window.location.href = p.link;
                };

                resultsBox.appendChild(div);
            });
        });

        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                let first = document.querySelector(".result-item");
                if (first) first.click();
            }
        });
    }

    // KEYBOARD SHORTCUTS
    document.addEventListener("keydown", function (e) {

        if ((e.ctrlKey && e.key.toLowerCase() === "k") || e.key === "/") {
            e.preventDefault();
            openSearch();
            if (input) input.focus();
        }

        if (e.key === "Escape") {
            closeSearch();
        }
    });



    
});
///// =============================
// CONTACT FORM LOGIC
// =============================
const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        console.log("FORM SUBMITTED ✔");

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        console.log("SENDING DATA:", data);

        try {
            const res = await fetch("http://localhost:3000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            console.log("SERVER RESPONSE:", result);

            alert(result.message);

        } catch (error) {
            console.log("FETCH ERROR:", error);
            alert("Something went wrong connecting to server");
        }
    });
}
// =============================
// APPOINTMENT FORM LOGIC
// =============================
const appointmentForm = document.getElementById("appointmentForm");

if (appointmentForm) {
    appointmentForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("app_name").value,
            email: document.getElementById("app_email").value,
            date: document.getElementById("app_date").value,
            time: document.getElementById("app_time").value,
            type: document.getElementById("app_type").value
        };

        const res = await fetch("http://localhost:3000/appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);
    });
}


// =============================
// HELPDESK FORM CONNECTION
// =============================

const helpdeskForm = document.getElementById("helpdeskForm");

if (helpdeskForm) {
    helpdeskForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("hd_name").value,
            email: document.getElementById("hd_email").value,
            category: document.getElementById("hd_category").value,
            priority: document.getElementById("hd_priority").value,
            message: document.getElementById("hd_message").value
        };

        try {
            const res = await fetch("http://localhost:3000/helpdesk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alert(result.message);

            helpdeskForm.reset();

        } catch (error) {
            console.log("Helpdesk error:", error);
            alert("Something went wrong sending ticket");
        }
    });
}




// =============================
// FEEDBACK FORM
// =============================

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("fb_name").value,
            email: document.getElementById("fb_email").value,
            course: document.getElementById("fb_course").value,
            rating: document.getElementById("fb_rating").value,
            message: document.getElementById("fb_message").value
        };

        const res = await fetch("http://localhost:3000/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);

        feedbackForm.reset();
    });
}

// =============================
// LOGIN FORM
// =============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const studentNumber = document.getElementById("studentNumber").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ studentNumber, password })
            });

            const data = await res.json();

            if (data.success) {
                // ✅ SAVE USER DATA
                localStorage.setItem("student", JSON.stringify(data.student));

                // ✅ REDIRECT
                window.location.href = "portal.html";
            } else {
                alert("❌ Invalid login details");
            }

        } catch (err) {
            alert("⚠️ Server error");
            console.log(err);
        }
    });
}


// ================= LOAD STUDENT INFO =================
function loadStudent() {

    const student = JSON.parse(localStorage.getItem("student"));

    if (!student) {
        document.getElementById("studentInfo").innerHTML = "⚠️ Not logged in";
        return;
    }

    document.getElementById("studentInfo").innerHTML = `
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Course:</strong> ${student.course}</p>
        <p><strong>Email:</strong> ${student.email}</p>
    `;
}


// ================= LOAD ANNOUNCEMENTS =================
async function loadAnnouncements() {
    try {
        const res = await fetch("http://localhost:3000/announcements");
        const data = await res.json();

        let html = "";
        data.forEach(item => {
            html += `<p>📢 ${item.message}</p>`;
        });

        document.getElementById("announcementsBox").innerHTML = html;
    } catch (err) {
        document.getElementById("announcementsBox").innerHTML = "⚠️ Failed to load announcements";
    }
}


// ================= PORTAL CHAT =================
function sendPortalMessage() {

    const input = document.getElementById("portalChatInput");
    const chatBox = document.getElementById("portal-chat-box");

    const msg = input.value.trim();
    if (!msg) return;

    chatBox.innerHTML += `<div class="user-msg">${msg}</div>`;
    input.value = "";

    setTimeout(() => {

        let reply = "";

        if (msg.includes("result")) {
            reply = "📄 Results are available under Student Services.";
        }
        else if (msg.includes("fee")) {
            reply = "💳 Check your fee statement in Student Services.";
        }
        else if (msg.includes("help")) {
            reply = "👉 Please go to the Helpdesk page.";
        }
        else {
            reply = "🤖 Ask me about results, fees, or help.";
        }

        chatBox.innerHTML += `<div class="bot-msg">${reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    }, 500);
}


// ================= LOAD DATA =================
document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("studentInfo")) {
        loadStudent();
    }

    if (document.getElementById("announcementsBox")) {
        loadAnnouncements();
    }

});



console.log("AUTH LOADED");

// ================= LOGIN =================
async function login() {

    const studentNumber = document.getElementById("loginStudentNumber").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber, password })
    });

    const data = await res.json();

    if (data.success) {
        window.location.href = "home.html";
    } else {
        document.getElementById("msg").innerText = "❌ Invalid login details";
    }
}

// ================= REGISTER =================
async function register() {

    const name = document.getElementById("regName").value;
    const studentNumber = document.getElementById("regStudentNumber").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, studentNumber, email, password })
    });

    const data = await res.json();

    if (data.success) {
        alert("✅ Registered successfully! Now login.");
    } else {
        alert("❌ Registration failed");
    }
}


console.log("PORTAL LOADED");

// LOAD STUDENT INFO
async function loadStudent() {

    const res = await fetch("http://localhost:3000/student");
    const data = await res.json();

    document.getElementById("studentName").innerText = "Name: " + data.name;
    document.getElementById("studentEmail").innerText = "Email: " + data.email;
    document.getElementById("studentNumber").innerText = "Student No: " + data.student_number;
}

// LOAD TIMETABLE
async function loadTimetable() {

    const res = await fetch("http://localhost:3000/timetable");
    const data = await res.json();

    const box = document.getElementById("timetable");

    box.innerHTML = data.map(t =>
        `<p>${t.day} | ${t.subject} | ${t.time} | ${t.venue}</p>`
    ).join("");
}

// LOAD ANNOUNCEMENTS
async function loadAnnouncements() {

    const res = await fetch("http://localhost:3000/announcements");
    const data = await res.json();

    const box = document.getElementById("announcements");

    box.innerHTML = data.map(a =>
        `<p>📢 ${a.message}</p>`
    ).join("");
}

// UPLOAD FILE
async function uploadFile() {

    const file = document.getElementById("fileInput").files[0];

    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    document.getElementById("uploadMsg").innerText = data.message;
}

// INIT
loadStudent();
loadTimetable();
loadAnnouncements();