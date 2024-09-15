module.exports = {
  apps: [
    {
      name: "my-react-app",
      script: "serve",
      args: ["-s", "build", "-l", "3000"],
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: "local",
      },
    },
  ],
};
