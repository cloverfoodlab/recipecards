const express = require("express");
const app = express();
const peachworks = require("./peachworks");
const db = require("./db");

app.get("/api/recipes", function(req, res) {
  db.getRecipes(req, res);
});

app.get("/api/recipe/:id", function(req, res) {
  db.getRecipe(req, res);
});

const path = require("path");

if (process.env.NODE_ENV !== "production") {
  app.use("/dist", express.static("static"));

  const webpack = require("webpack");
  const config = require("../webpack.config.dev");
  const compiler = webpack(config);
  const webpackDevMiddleware = require("webpack-dev-middleware");

  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    })
  );

  const webpackHotMiddleware = require("webpack-hot-middleware");
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use("/dist", express.static("dist"));
}

app.get("/", function(req, res) {
  let index_path = path.resolve(__dirname, "../index.html");
  res.sendFile(index_path);
});

app.get("/recipe/:id", function(req, res) {
  let index_path = path.resolve(__dirname, "../index.html");
  res.sendFile(index_path);
});

app.listen(3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Listening at port 3000");
});
