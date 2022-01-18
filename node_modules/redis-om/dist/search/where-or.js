"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const where_1 = __importDefault(require("./where"));
class WhereOr extends where_1.default {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    toString() {
        return `( ${this.left.toString()} | ${this.right.toString()} )`;
    }
}
exports.default = WhereOr;
