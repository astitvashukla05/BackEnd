import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import app from './app.js';

dotenv.config({
  path: './.env'
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("App listening on port", process.env.PORT || 8080);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed", err);
  });
