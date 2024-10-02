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
    
    // fetch(window.location.origin + "/cmd/" + encodeURIComponent(`${commandInput.value}`)).then(res => {
    //     if (res.ok) return res.text();
    //     else {
    //         alert ("Problem");
    //     }
    // }).then(data => {
    //     if (data != "ok") textarea.textContent += data;
    // }).catch((err) => {
    //     textarea.textContent += err;
    // })
}