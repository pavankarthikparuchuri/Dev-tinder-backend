const express = require("express");

const app = express(); //ceating an express application instance.

//order of the routes matter
//app.use method maps to all the http methods
app.get("/user/:userId/:name", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send("hey get call");
});

app.post("/user", (req, res) => {
  res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res) => {
  res.send("deleted successfully");
});

app.patch("/user", (req, res) => {
  res.send("updated successfully");
});

// it will work for ac and abc
app.get("/ab?c", (req, res) => {
  res.send("b is optional here");
});

app.get("/de+f", (req, res) => {
  res.send("we can write any number of e's in between d and f");
});

app.get("/gh*ij", (req, res) => {
  res.send("in between gh and ij we can write anything in between");
});

app.get("/k(lm)?n", (req, res) => {
  res.send("lm are optional");
});
//we can also write regex in the route
app.get(/a/, (req, res) => {
  res.send("if the route contains a it will match this path");
});

app.get(/.*fly$/, (req, res) => {
  res.send("matches any routes that ends with fly");
});
app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
