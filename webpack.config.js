import Dotenv from "dotenv-webpack";

export default {
  // ... other config
  plugins: [
    new Dotenv(), // Loads .env file
  ],
};
