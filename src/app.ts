import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controlers/book.controlers";
import { borrowRoutes } from "./app/controlers/borrow.controler";

const app: Application = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(" Welcome Library Management App");
});

export default app;
