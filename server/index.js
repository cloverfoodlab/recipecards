const express = require("express");
const app = express();
const path = require("path");
const webpack = require("webpack");
const peachworks = require("./peachworks");
const dbController = require("./dbController");
const cron = require("./cron");

const isDebug = process.env.NODE_ENV !== "production";

const config = isDebug
  ? require("../webpack.config.dev")
  : require("../webpack.config.prod");
const webpackDevMiddleware = isDebug ? require("webpack-dev-middleware") : null;
const webpackHotMiddleware = isDebug ? require("webpack-hot-middleware") : null;

cron.scheduleJobs();

if (isDebug) {
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

app.get("/api/recipes", (req, res) => {
  dbController.getRecipes(req, res);
});

app.get("/api/menu_recipe/:id", (req, res) => {
  dbController.getRecipe(req, res, true);
});

app.get("/api/prep_recipe/:id", (req, res) => {
  dbController.getRecipe(req, res, false);
});

app.get("/api/item_nutrition/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new Error("invalid id");
  }

  peachworks
    .proxyGetItemNutrition(id)
    .then(json => {
      res.json(json);
    })
    .catch(err => {
      if (err.status !== 404) {
        throw err;
      }
      console.log("error loading nutrition.");
    });
});

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
