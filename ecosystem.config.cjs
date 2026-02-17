module.exports = {
  apps: [
    {
      name: 'centy-app',
      script: 'npx',
      args: 'vite',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
