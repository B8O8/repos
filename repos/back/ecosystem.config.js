module.exports = {
  apps: [
    {
      name: "my-node-app",
      script: "dist/src/app.js",
      env: {
        port: 5000,
        NODE_ENV: "production",
      },
    },
  ],
};
