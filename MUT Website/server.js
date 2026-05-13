process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//app.use("/uploads", express.static("uploads"));

const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

// ✅ SAFE FETCH FOR NODE 24 (WORKS EVERY TIME)
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use(express.static(__dirname + "/public"));

// serve uploads safely
app.use("/uploads", express.static("uploads"));
// DB
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Mut0882084",
    database: "mutict",
    port: 3307
});

// EMAIL
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mutictdepartment@gmail.com",
        pass: "ehbjyxnglqvippku" // app password
    }
});

// TEST
db.connect((err) => {
    if (err) console.log(err);
    else console.log("Connected to MySQL database!");
});

app.post("/contact", (req, res) => {

    console.log("CONTACT ROUTE WORKING ✔");

    const { name, email, message } = req.body;

    const sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
db.query(sql, [name, email, message], (err) => {

    if (err) {
        console.log("DATABASE ERROR FULL:", err); // IMPORTANT
        return res.json({ message: "Database error" });
    }


       transporter.sendMail({
    from: "mutictdepartment@gmail.com",
    to: "mutictdepartment@gmail.com",
    subject: "New Contact Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
}, (error, info) => {

    if (error) {
        console.log("❌ EMAIL FAILED:", error);
    } else {
        console.log("✅ EMAIL SENT:", info.response);
    }

});

        res.json({ message: "Message submitted successfully!" });
    });
});



app.post("/appointment", (req, res) => {

    console.log("APPOINTMENT ROUTE WORKING ✔");
    console.log(req.body);

    const { name, email, date, time, type } = req.body;

    const sql = `
        INSERT INTO appointments (name, email, date, time, type)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, date, time, type], (err) => {

        if (err) {
            console.log(err);
            return res.json({ message: "Database error" });
        }

        transporter.sendMail({
            from: "mutictdepartment@gmail.com",
            to: "mutictdepartment@gmail.com",
            subject: "New Appointment Booking",
            text: `
Name: ${name}
Email: ${email}
Date: ${date}
Time: ${time}
Type: ${type}
            `
        }, (err, info) => {
            if (err) {
                console.log("EMAIL ERROR:", err);
            } else {
                console.log("APPOINTMENT EMAIL SENT:", info.response);
            }
        });

        res.json({ message: "Appointment booked successfully!" });
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
}).on("error", (err) => {
    console.log("SERVER ERROR:", err);
});


app.post("/helpdesk", (req, res) => {

    console.log("HELPDESK ROUTE WORKING ✔");

    const { name, email, category, priority, message } = req.body;

    const sql = `
        INSERT INTO helpdesk_tickets (name, email, category, priority, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, category, priority, message], (err) => {

        if (err) {
            console.log(err);
            return res.json({ message: "Database error" });
        }

        transporter.sendMail({
            from: "mutictdepartment@gmail.com",
            to: "mutictdepartment@gmail.com",
            subject: "New Helpdesk Ticket",
            text: `
Name: ${name}
Email: ${email}
Category: ${category}
Priority: ${priority}
Message: ${message}
            `
        }, (err, info) => {
            if (err) console.log("EMAIL ERROR:", err);
            else console.log("EMAIL SENT:", info.response);
        });

        res.json({ message: "Helpdesk ticket submitted successfully!" });
    });
});


// =============================
// FEEDBACK ROUTE
// =============================
app.post("/feedback", (req, res) => {

    console.log("FEEDBACK ROUTE WORKING ✔");

    const { name, email, course, rating, message } = req.body;

    const sql = `
        INSERT INTO feedback (name, email, course, rating, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, course, rating, message], (err) => {

        if (err) {
            console.log("DB ERROR:", err);
            return res.json({ message: "Database error saving feedback" });
        }

        transporter.sendMail({
            from: "mutictdepartment@gmail.com",
            to: "mutictdepartment@gmail.com",
            subject: "New Website Feedback",
            text: `
New Feedback Received:

Name: ${name}
Email: ${email}
Course: ${course}
Rating: ${rating}
Message: ${message}
            `
        }, (err, info) => {
            if (err) console.log("EMAIL ERROR:", err);
            else console.log("EMAIL SENT:", info.response);
        });

        res.json({ message: "Feedback submitted successfully!" });
    });
});


app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;

    if (!userMessage) {
        return res.json({ reply: "Please type a message." });
    }

    const msg = userMessage.toLowerCase();

    // ==============================
    // 🧠 SMART KNOWLEDGE BASE (FAST)
    // ==============================

    const knowledge = [
        {
            keywords: ["course", "ict", "offer"],
            answer: " ICT at MUT offers:\n• Software Development\n• Networking\n• Multimedia"
        },
        {
            keywords: ["contact", "phone", "email"],
            answer: " Contact MUT ICT:\n031 907 7111\ninfo@mut.ac.za"
        },
        {
            keywords: ["help", "support"],
            answer: " Visit the ICT Helpdesk page or contact support."
        },
        {
            keywords: ["event", "workshop"],
            answer: " ICT hosts:\n• Hackathons\n• Workshops\n• Seminars"
        },
        {
            keywords: ["portal", "login"],
            answer: "🔐 Use your student number and password to access the portal."
        }
    ];

    // 🔍 CHECK KNOWLEDGE FIRST
    for (let item of knowledge) {
        if (item.keywords.some(word => msg.includes(word))) {
            return res.json({ reply: item.answer });
        }
    }

    // ==============================
    // 🤖 AI (ONLY IF NOT FOUND)
    // ==============================

    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
You are the MUT ICT Assistant.

- Keep answers short (max 3 lines)
- Be clear and helpful
- Do NOT give long paragraphs
- Do NOT guess university facts
- If unsure, say: "Please contact the ICT office"

Speak like a student support assistant.
                        `
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok || !data.choices?.length) {
            throw new Error("AI failed");
        }

        return res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {

        console.log("AI ERROR:", error.message);

        return res.json({
            reply: "⚠️ I’m having trouble right now. Try asking about courses, contact, or events."
        });
    }
});





// ================= REGISTER =================
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err) => {
        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        res.json({ success: true });
    });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.json({ success: false });
        }
    });
});

// ================= CHAT (SIMPLE SMART BASE) =================
app.post("/chat", (req, res) => {

    const msg = req.body.message.toLowerCase();

    if (msg.includes("course")) {
        return res.json({ reply: "We offer Software Development, Networking, Multimedia." });
    }

    if (msg.includes("contact")) {
        return res.json({ reply: "Contact: 031 907 7111 | info@mut.ac.za" });
    }

    return res.json({ reply: "I can help with courses, contact info, or general questions." });
});

// ================= SERVER =================
//app.listen(3000, () => {
  //  console.log("Server running on http://localhost:3000");
//});





app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

// ================= STUDENT INFO (TEST) =================
app.get("/student", (req, res) => {
    db.query("SELECT * FROM users LIMIT 1", (err, result) => {
        res.json(result[0]);
    });
});

app.get("/timetable", (req, res) => {
    db.query("SELECT * FROM timetable", (err, result) => {
        res.json(result);
    });
});

app.get("/announcements", (req, res) => {
    db.query("SELECT * FROM announcements", (err, result) => {
        res.json(result);
    });
});




// ================= PORTAL LOGIN (STUDENT NUMBER) =================
app.post("/portal-login", (req, res) => {

    const { student_number, password } = req.body;

    const sql = `
        SELECT * FROM students 
        WHERE student_number = ? AND password = ?
    `;

    db.query(sql, [student_number, password], (err, results) => {

        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        if (results.length > 0) {

            const user = results[0];

            res.json({
                success: true,
                user: {
                    name: user.name,
                    email: user.email,
                    course: user.course
                }
            });

        } else {
            res.json({ success: false });
        }

    });

});




const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "uploads");

// make uploads public
app.use("/uploads", express.static(uploadDir));

// ensure folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ================= MULTER =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ================= CREATE =================
app.post("/upload", upload.single("file"), (req, res) => {

    if (!req.file) return res.json({ success: false });

    const sql = `
        INSERT INTO uploads (student_name, filename, original_name)
        VALUES (?, ?, ?)
    `;

    db.query(sql,
        ["Demo Student", req.file.filename, req.file.originalname],
        (err) => {

            if (err) {
                console.log(err);
                return res.json({ success: false });
            }

            res.json({
                success: true,
                file: req.file.filename
            });
        }
    );
});

// ================= READ =================
app.get("/files", (req, res) => {

    db.query("SELECT * FROM uploads ORDER BY id DESC", (err, results) => {

        if (err) {
            console.log(err);
            return res.json([]);
        }

        res.json(results);
    });
});

// ================= DELETE =================
app.delete("/delete-file/:id", (req, res) => {

    const id = req.params.id;

    db.query("SELECT filename FROM uploads WHERE id = ?", [id], (err, results) => {

        if (err || results.length === 0) {
            return res.json({ success: false });
        }

        const filePath = path.join(uploadDir, results[0].filename);

        fs.unlink(filePath, () => {

            db.query("DELETE FROM uploads WHERE id = ?", [id], (err2) => {

                if (err2) return res.json({ success: false });

                res.json({ success: true });
            });
        });
    });
});

// ================= UPDATE (RENAME) =================
app.put("/rename-file", (req, res) => {

    const { id, oldName, newName } = req.body;

    if (!id || !oldName || !newName) {
        return res.json({ success: false });
    }

    const oldPath = path.join(uploadDir, oldName);
    const newPath = path.join(uploadDir, newName);

    fs.rename(oldPath, newPath, (err) => {

        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        const sql = `
            UPDATE uploads 
            SET filename = ?, original_name = ? 
            WHERE id = ?
        `;

        db.query(sql, [newName, newName, id], (err2) => {

            if (err2) {
                console.log(err2);
                return res.json({ success: false });
            }

            res.json({ success: true });
        });
    });
});

