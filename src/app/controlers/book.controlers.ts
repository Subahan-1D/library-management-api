import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { z } from "zod";
import { handleError } from "../utils/errorHandaler";

export const bookRoutes = express.Router();

const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().optional(),
  copies: z.number().min(1 , "Copies must be a positive number"),
  available: z.boolean(),
});

bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const booksParse = BookSchema.parse(req.body);
    const book = await Book.create(booksParse);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleError(res, 400, "Validation failed", error);
      return;
    }

    handleError(res, 500, "Failed to create book", error);
  }
});

bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = "createdAt", sort = "asc", limit } = req.query;

    const query: any = {};

    if (filter) {
      query.genre = filter.toString().toUpperCase();
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    let findBooks = Book.find(query).sort({
      [sortBy as string]: sortOrder,
    });

    if (limit !== undefined) {
      const parseLimit = parseInt(limit as string);
      if (!isNaN(parseLimit) && parseLimit > 0) {
        findBooks = findBooks.limit(parseLimit);
      }
    }

    const books = await findBooks;

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    handleError(
      res,
      500,
      "Something went wrong fetching retrieve books",
      error
    );
  }
});

bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        error: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve books", error);
  }
});

