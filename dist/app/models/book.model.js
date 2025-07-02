"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        uppercase: true,
    },
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    copies: {
        type: Number,
        required: [true, "Copies is required"],
        min: [0, "Copies must be a positive number"],
        default: 1,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.methods.updateAvailability = function () {
    this.available = this.copies > 0;
    return this.save();
};
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
