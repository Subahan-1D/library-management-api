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
  copies: z.number().min(1, "Copies must be a positive number"),
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
    const {
      filter,
      sortBy = "createdAt",
      sort = "asc",
      limit,
      page,
    } = req.query;

    const query: any = {};

    if (filter) {
      query.genre = filter.toString().toUpperCase();
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    // Pagination setup
    const parseLimit = limit ? parseInt(limit as string) : 6;
    const parsePage = page ? parseInt(page as string) : 1;
    const skip = (parsePage - 1) * parseLimit;

    // Total documents count for pagination
    const total = await Book.countDocuments(query);

    // Build findBooks query
    let findBooks = Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(parseLimit);

    const books = await findBooks;

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      meta: {
        total,
        page: parsePage,
        limit: parseLimit,
        totalPages: Math.ceil(total / parseLimit),
      },
    });
  } catch (error) {
    handleError(
      res,
      500,
      "Something went wrong fetching books",
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

bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updateData = req.body;
    const updateBook = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateBook) {
      res.status(404).json({
        success: false,
        message: "Book Not Found",
        error: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updateBook,
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve books", error);
  }
});

bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    const bookDelete = await Book.findByIdAndDelete(bookId);

    if (!bookDelete) {
      res.status(400).json({
        success: false,
        message: `Book id is ${bookId} not found`,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve books", error);
  }
});
