"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const where_field_1 = __importDefault(require("./where-field"));
class WhereArray extends where_field_1.default {
    contain(value) {
        this.value = [value];
        return this.search;
    }
    contains(value) { return this.contain(value); }
    containsOneOf(...value) {
        this.value = value;
        return this.search;
    }
    containOneOf(...value) { return this.containsOneOf(...value); }
    toString() {
        let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~| ]/g;
        let escapedValue = this.value.map(s => s.replace(matchPunctuation, '\\$&')).join('|');
        return this.buildQuery(`{${escapedValue}}`);
    }
}
exports.default = WhereArray;
