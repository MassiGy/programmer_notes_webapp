"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const where_field_1 = __importDefault(require("./where-field"));
class WhereString extends where_field_1.default {
    eq(value) {
        this.value = value;
        return this.search;
    }
    equal(value) { return this.eq(value); }
    equals(value) { return this.eq(value); }
    equalTo(value) { return this.eq(value); }
    toString() {
        let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
        let escapedValue = this.value.replace(matchPunctuation, '\\$&');
        return this.buildQuery(`{${escapedValue}}`);
    }
}
exports.default = WhereString;
