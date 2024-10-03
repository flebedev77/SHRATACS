# SHRATCACS
 ---
## Simple Http RAT Command And Control Server

### Installation
 - Clone the repository `https://github.com/flebedev77/SHRATACS.git --depth=1`
 - Install dependencies `npm i`
 - Start the server `node .`

### How does the RAT connect?
#### Recieving commands
You might need to write a custom RAT, essentially the rat needs to continously make `GET` requests to the server's `/get-command` route. The server will either respond with an empty string, or a command it wants the RAT to run.

#### Replying with output
Once the RAT has the output of the command ran, it can send the output to the server's `/send-output` route using a `POST` request and in `plain/text` for the server to recognise the output correctly.

### Changing the password
The default password is `smoke`. To change it, delete the `pass` file and rerun the server. It will then prompt you to make a new password, it will then store it in a new `pass` file.