import express, { Request, Response } from "express";
import { handleError } from "../utils/errorHandaler";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.models";
export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  const { book, quantity, dueDate } = req.body;
  try {
    const foundBook = await Book.findById(book);
    if (!foundBook) {
      return handleError(res, 404, "book not found");
    }

    foundBook.copies -= quantity;
    await foundBook.updateAvailability();

    if (foundBook.copies < quantity) {
      return handleError(res, 400, "Not enough copies available");
    }

    const borrow = await Borrow.create({ book, quantity, dueDate });

    res.status(200).json({
      success: true,
      message: "Borrowed Books Successfully",
      data: borrow,
    });
  } catch (error) {
    handleError(res, 500, "Failed to borrow book", error);
  }
});

