module.exports = {
  apps: [
    {
      name: "worker_dev",
      script: "dist/index.js",
      env: {
        PORT: 3001,
        NODE_ENV: "development",
      },
    },
    {
      name: "worker_prod",
      script: "dist/index.js",
      env: {
        PORT: 3002,
        NODE_ENV: "production",
      },
    },
  ],
};
