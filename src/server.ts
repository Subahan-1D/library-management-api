import mongoose from "mongoose";

import { Server } from "http";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

let server: Server;

const PORT = 8000;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connecting to mongodb using mongoose !!");
    server: app.listen(PORT, () => {
      console.log(`App is the listening on port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main() ;
