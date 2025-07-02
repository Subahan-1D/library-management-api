"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controlers_1 = require("./app/controlers/book.controlers");
const borrow_controler_1 = require("./app/controlers/borrow.controler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", book_controlers_1.bookRoutes);
app.use("/api/borrow", borrow_controler_1.borrowRoutes);
app.get("/", (req, res) => {
    res.send(" Welcome Library Management App");
});
exports.default = app;
