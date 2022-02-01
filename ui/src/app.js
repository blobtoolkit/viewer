const express = require("express");
const path = require("path");
const PORT = process.env.BTK_PORT || process.env.BTK_CLIENT_PORT || "8080";
const BTK_API_PORT = process.env.BTK_API_PORT || "8000";
const BTK_API_URL =
  process.env.BTK_API_URL || `http://localhost:${BTK_API_PORT}/api/v1`;
const app = express();

// set the view engine to ejs
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// serve static assets normally
console.log(__dirname);
app.use("/view", express.static(path.resolve(__dirname, "public")));
app.use(
  "/manifest.json",
  express.static(path.resolve(__dirname, "public/manifest.json"))
);

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (req, res) {
  // response.sendFile(path.resolve(__dirname, "view/index.html"));
  res.render("index", {
    variables: `window.process = {ENV: { BTK_API_URL: "${BTK_API_URL}" }}`,
  });
});

app.listen(PORT);
console.log("server started on port " + PORT);
