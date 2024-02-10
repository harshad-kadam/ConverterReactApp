// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/u',
    createProxyMiddleware({
      target: 'https://kadamharshad25-eval-prod.apigee.net',
      changeOrigin: true,
      pathRewrite: {
        '^/u': '/u',
      },
    })
  );
};
