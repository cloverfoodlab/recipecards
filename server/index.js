const express = require('express');
const app = express();
const peachworks = require('./peachworks');

app.get('/api/wtm_recipes', function (req, res) {
    peachworks.proxyGetRecipes(req, res);
});

const webpack = require('webpack');
const path = require('path');

if (process.env.NODE_ENV !== "production") {
  app.use('/dist', express.static('static'));

  const config = require('../webpack.config.dev');

  const compiler = webpack(config);
  const webpackDevMiddleware = require('webpack-dev-middleware');

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  const webpackHotMiddleware = require('webpack-hot-middleware');
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/dist', express.static('dist'));
}

// default fallthrough path so SPA routes direct to index page
// maybe we should be more explicit about the routes eventually?
// but this is fine for now.
app.get('*', function(req, res) {
    let index_path = path.resolve(__dirname, '../index.html');
    res.sendFile(index_path);
});

app.listen(3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Listening at port 3000");
});
