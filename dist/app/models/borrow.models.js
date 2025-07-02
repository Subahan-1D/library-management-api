"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "book",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "at list 1 copies must be borrowed"],
    },
    dueDate: { type: Date, required: true },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
