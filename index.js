const express = require("express");
const app = express();
const PORT = 3000;
// const { nc } = require("./nc");
const bodyparser = require("body-parser");

app.use(express.static("public"));
app.use(express.json());
app.use(bodyparser.text());

const io = require("socket.io")(app.listen(PORT, console.log(`Server listening on port ${PORT}`)));

let currentCommand = "";
// let previousCommand = "";

// nc.stdout.on("data", (data) => {
//     console.log(`stdout: ${data}`);
//     io.sockets.emit("log", data.toString("ascii"));
// });

// // Handle stderr
// nc.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
//     io.sockets.emit("log", data.toString("ascii"));
// });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/cmd/:command", (req, res) => {
    // const cmd = req.params.command;
    // if (cmd.trim() == "") {
    //     res.send("Bad command");
    //     return;
    // }

    // nc.stdin.write(cmd + "\n");
    // res.send("ok");
})

io.on("connection", (socket) => {
})

app.post("/send-ui-command-to-backend", (req, res) => {
    currentCommand = req.body.command + "\n";
    res.set("Content-Type", "text/plain");
    res.send("pending\n");
})

app.post("/send-output", (req, res) => {
    console.log(req.body);
    // const processed = req.body.replace(previousCommand, previousCommand + "\n") + "\n";
    const processed = req.body + "\n";
    io.sockets.emit("log", processed);
    res.set("Content-Type", "text/plain");
    res.send("Received");
})

app.get("/get-command", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(currentCommand);
    // previousCommand = currentCommand;
    currentCommand = "";
})