module.exports = {
  apps: [
    {
      name: "my-react-app",
      script: "serve",
      args: "-s build -l 4000", // `-s` for serving the build directory and `-l` for port
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
