import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    try {
      // Add your own custom logger
      // Pass custom parameters to login
      await handleLogin(req, res, {
        authorizationParams: {
          connection: "twitter",
        },
      });
    } catch (error) {
      // Add your own custom error handling
      res.status(error.status || 400).end(error.message);
    }
  },
});
