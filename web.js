// Web
const express = require("express");
const logger = require("morgan");
const app = express();

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send({message : 'Hello World'});
})
module.exports = (client, PORT) => {
	require("./router/main")(app, client);//여기에 api root
	
	app.listen(PORT, () => {
        console.log(`[WebServer] Server on : ${PORT}`);
    });
}