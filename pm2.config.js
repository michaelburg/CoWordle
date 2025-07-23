module.exports = {
  apps: [
    {
      name: "cowordle-server",
      script: "server/index.ts",
      interpreter: "./node_modules/.bin/tsx",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
