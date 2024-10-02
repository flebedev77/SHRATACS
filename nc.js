const { spawn } = require("child_process");

// Define the command and arguments
const command = "nc";
const args = ["-lvp", "4444"];

// Spawn a new process
const nc = spawn(command, args);

// Write input data to the command"s stdin
// setTimeout(() => {
//     nc.stdin.write("start notepad.exe\n");
//     nc.stdin.end(); // Close the stdin stream
// }, 5000)

// Handle stdout


// Handle process exit
nc.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
});

exports.nc = nc;