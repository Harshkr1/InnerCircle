const express = require("express");
const app = express();
const path = require("path");
const { indexRouter } = require("./routers/indexRouter.js");

const PORT = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// To parse data from the form we need to encode
// the data from url.
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", indexRouter);

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.render("error", { err: err });
});

app.listen(PORT, (error) => {
  if (error) {
    throw new error();
  }
  console.log(`listening to port ${PORT}`);
});
