// Web
const express = require("express");
const logger = require("morgan");
const app = express();

app.use(express.json())


module.exports = (client, PORT) => {
	require("./router/main")(app, client);
	
	app.listen(PORT, () => {
        console.log(`[WebServer] Server on : ${PORT}`);
    });
}