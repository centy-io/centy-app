module.exports = {
  apps: [
    {
      name: "centy-app",
      script: "node_modules/.bin/vite",
      watch: false,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
