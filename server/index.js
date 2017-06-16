const express = require("express");
const app = express();
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("../webpack.config.dev");
const peachworks = require("./peachworks");
const dbController = require("./dbController");
const cron = require("./cron");

cron.scheduleJobs();

app.get("/api/recipes", (req, res) => {
  dbController.getRecipes(req, res);
});

app.get("/api/menu_recipe/:id", (req, res) => {
  dbController.getRecipe(req, res, true);
});

app.get("/api/prep_recipe/:id", (req, res) => {
  dbController.getRecipe(req, res, false);
});

if (process.env.NODE_ENV !== "production") {
  app.use("/dist", express.static("static"));

  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    })
  );

  app.use(webpackHotMiddleware(compiler));
} else {
  app.use("/dist", express.static("dist"));
}

app.get("/", (req, res) => {
  let indexPath = path.resolve(__dirname, "../index.html");
  res.sendFile(indexPath);
});

app.get("/menu_recipe/:id", (req, res) => {
  let indexPath = path.resolve(__dirname, "../index.html");
  res.sendFile(indexPath);
});

app.get("/prep_recipe/:id", (req, res) => {
  let indexPath = path.resolve(__dirname, "../index.html");
  res.sendFile(indexPath);
});

app.listen(3000, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Listening at port 3000");
});
