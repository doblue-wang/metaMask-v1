const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const devProxy = {
  "/api/": {
    target: "http://127.0.0.1:22507",
    changeOrigin: true,
  },
};
const productionProxy = {
  "/api": {
    target: "https://api.zhetuitui.com",
    pathRewrite: {
      "^/api/": "/",
      "^/api2/": "/",
      "^/api3/": "/",
    },
    changeOrigin: true,
  },
};
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const proxy = dev ? devProxy : productionProxy
// const proxy = devProxy;

app
  .prepare()
  .then(() => {
    const server = express();

    for (const key in proxy) {
      server.use(createProxyMiddleware(key, proxy[key]));
    }

    server.all("*", (req, res) => {
      handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });