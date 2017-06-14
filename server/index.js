const express = require("express");
const app = express();
const peachworks = require("./peachworks");
const db = require("./db");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("../webpack.config.dev");
const path = require("path");

app.get("/api/recipes", (req, res) => {
  db.getRecipes(req, res);
});

app.get("/api/recipe/:id", (req, res) => {
  db.getRecipe(req, res);
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

app.get("/recipe/:id", (req, res) => {
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
