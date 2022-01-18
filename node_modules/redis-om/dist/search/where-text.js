"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const where_field_1 = __importDefault(require("./where-field"));
class WhereText extends where_field_1.default {
    constructor() {
        super(...arguments);
        this.exactValue = false;
    }
    match(value) {
        this.value = value;
        return this.search;
    }
    matchExact(value) {
        this.exact.value = value;
        return this.search;
    }
    matches(value) { return this.match(value); }
    matchExactly(value) { return this.matchExact(value); }
    matchesExactly(value) { return this.matchExact(value); }
    get exact() {
        this.exactValue = true;
        return this;
    }
    get exactly() {
        return this.exact;
    }
    toString() {
        let matchPunctuation = /[,.<>{}[\]"':;!@#$%^&*()\-+=~|]/g;
        let escapedValue = this.value.replace(matchPunctuation, '\\$&');
        if (this.exactValue) {
            return this.buildQuery(`"${escapedValue}"`);
        }
        else {
            return this.buildQuery(`'${escapedValue}'`);
        }
    }
}
exports.default = WhereText;
