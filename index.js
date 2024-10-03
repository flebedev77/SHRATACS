const express = require("express");
const app = express();
const PORT = 3000;
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const crypto = require("crypto");
const createHash = require("./hashing");

app.use(express.static("public"));
app.use(express.json());
app.use(bodyparser.text());
app.use(cookieParser());

const io = require("socket.io")(app.listen(PORT, console.log(`Server listening on port ${PORT}`)));

const passHashFilePath = path.join(__dirname, "pass");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


let appAccessHash = "";
if (fs.existsSync(passHashFilePath)) {
    appAccessHash = fs.readFileSync(passHashFilePath);
}

if (!fs.existsSync(passHashFilePath)) {
    console.log("Stored password hash does not exist!");
    rl.question('New password: ', (answer) => {
        const hash = createHash(answer);
        fs.writeFileSync(passHashFilePath, hash);
        appAccessHash = hash;
        rl.close();
    });
}

let currentCommand = "";
let authenticatedCookies = [];
let authenticatedSocketIds = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

io.on("connection", (socket) => {
})

app.post("/send-ui-command-to-backend", (req, res) => {
    if (!authenticatedCookies.includes(req.cookies.session)) {
        res.send("UNAUTHENTICATED!");
        return;
    }
    currentCommand = req.body.command + "\n";
    res.set("Content-Type", "text/plain");
    res.send("pending\n");
})

app.post("/send-output", (req, res) => {
    const processed = req.body + "\n";
    authenticatedSocketIds.forEach((id) => {
        console.log(id)
        io.to(id).emit("log", processed);
    })
    res.set("Content-Type", "text/plain");
    res.send("Received");
})

app.get("/get-command", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(currentCommand);
    currentCommand = "";
})

app.post("/auth", (req, res) => {
    const password = req.body.password;
    const sessionCookie = req.cookies.session;
    if (password == null || password.trim() == "") {
        if (sessionCookie == null || sessionCookie.trim().length == 0) {
            res.json({ ok: false });
            return;
        }

        if (authenticatedCookies.includes(sessionCookie)) {
            res.json({ ok: true });
            return;
        } else {
            res.clearCookie("session", { path: "/" });
            res.json({ ok: false });
            return;
        }
    } else {
        //gen cookie
        if (createHash(password) == appAccessHash) {
            const cookie = generateCookie();
            authenticatedCookies.push(cookie);

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow's date

            res.cookie('session', cookie, {
                expires: tomorrow,
                httpOnly: true, // Optional: helps prevent XSS attacks
                secure: false,   // Optional: use this if your site is HTTPS
                sameSite: 'Lax' // Optional: adjust based on your needs
            });

            if (req.body.socketId != null && req.body.socketId.trim().length != 0) {
                authenticatedSocketIds.push(req.body.socketId);
            }
        } else {
            res.json({ ok: false, message: "Incorrect password" });
            return
        }
    }
    res.json({ ok: true });
})

app.get("/delete-session", (req, res) => {
    if (req.cookies.session == null || req.cookies.session.trim().length == 0) {
        res.send("Session was already cleared");
        return;
    }
    const index = authenticatedCookies.indexOf(req.cookies.session);
    if (index != -1) {
        authenticatedCookies.splice(index, 1);
    }
    res.clearCookie("session", { path: "/" });
    res.send("Session cleared!")
})

function generateCookie() {
    return crypto.randomBytes(16).toString("hex");
}