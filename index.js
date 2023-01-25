const PORT = 80;
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();

// Middlewares
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/login", (req, res) => {
  res.redirect("./home/login.html");
});

require("./api/authentication")(app);
// require("./api/chat")(app);
// require("./api/external")(app);
// require("./api/global")(app);

app.get("/", (req, res) => {
  res.redirect("./home/login.html");
});

app.get("/home", (req, res) => {
  res.redirect("./home/login.html");
});

app.listen(PORT, () => console.log("Server listening on port: " + PORT));
