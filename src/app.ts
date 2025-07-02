import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controlers/book.controlers";

const app: Application = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(" Welcome Library Management App");
});

export default app;
