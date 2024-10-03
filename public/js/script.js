const commandInput = document.getElementById("commandInput");
const sendButton = document.getElementById("sendButton");
const textarea = document.querySelector("textarea");

const socket = io();

socket.on("log", (data) => {
    textarea.textContent += data;
})

sendButton.onclick = function() {
    fetch("/send-ui-command-to-backend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ command: commandInput.value })
    }).then(res => {
        if (res.ok) return res.text();
        else alert("oops")
    }).then(data => {
        textarea.textContent += data;
    }).catch(err => {
        textarea.textContent += err;
    })
}

const overlayParent = document.getElementById("overlay-parent");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");

loginButton.onclick = function() {
    if (passwordInput.value.trim() == "") return

    fetch("/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: passwordInput.value, socketId: socket.id })
    }).then(res => {
        if (res.ok) return res.json();
        else console.error(res.statusText)
    }).then(data => {
        if (data.ok) {
            overlayParent.remove();
        } else {
            alert(data.message);
        }
    })
}

window.onload = function() {
    fetch("/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: null, socketId: socket.id })
    }).then(res => {
        if (res.ok) return res.json();
        else console.error(res.statusText);
    }).then(data => {
        if (data.ok) {
            overlayParent.remove();
        }
    })
}