"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const errorHandaler_1 = require("../utils/errorHandaler");
const book_model_1 = require("../models/book.model");
const borrow_models_1 = require("../models/borrow.models");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book, quantity, dueDate } = req.body;
    try {
        const foundBook = yield book_model_1.Book.findById(book);
        if (!foundBook) {
            return (0, errorHandaler_1.handleError)(res, 404, "book not found");
        }
        foundBook.copies -= quantity;
        yield foundBook.updateAvailability();
        if (foundBook.copies < quantity) {
            return (0, errorHandaler_1.handleError)(res, 400, "Not enough copies available");
        }
        const borrow = yield borrow_models_1.Borrow.create({ book, quantity, dueDate });
        res.status(200).json({
            success: true,
            message: "Borrowed Books Successfully",
            data: borrow,
        });
    }
    catch (error) {
        (0, errorHandaler_1.handleError)(res, 500, "Failed to borrow book", error);
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const summary = yield borrow_models_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        const total = summary.length;
        const paginated = summary.slice(skip, skip + limit);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: paginated,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        (0, errorHandaler_1.handleError)(res, 500, "Failed to retrieve summary", error);
    }
}));
