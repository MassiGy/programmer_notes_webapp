"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const where_field_1 = __importDefault(require("./where-field"));
class WhereNumber extends where_field_1.default {
    constructor() {
        super(...arguments);
        this.lower = Number.NEGATIVE_INFINITY;
        this.upper = Number.POSITIVE_INFINITY;
        this.lowerExclusive = false;
        this.upperExclusive = false;
    }
    eq(value) {
        this.lower = value;
        this.upper = value;
        return this.search;
    }
    gt(value) {
        this.lower = value;
        this.lowerExclusive = true;
        return this.search;
    }
    gte(value) {
        this.lower = value;
        return this.search;
    }
    lt(value) {
        this.upper = value;
        this.upperExclusive = true;
        return this.search;
    }
    lte(value) {
        this.upper = value;
        return this.search;
    }
    between(lower, upper) {
        this.lower = lower;
        this.upper = upper;
        return this.search;
    }
    equal(value) { return this.eq(value); }
    equals(value) { return this.eq(value); }
    equalTo(value) { return this.eq(value); }
    greaterThan(value) { return this.gt(value); }
    greaterThanOrEqualTo(value) { return this.gte(value); }
    lessThan(value) { return this.lt(value); }
    lessThanOrEqualTo(value) { return this.lte(value); }
    toString() {
        let lower = this.makeLowerString();
        let upper = this.makeUpperString();
        return this.buildQuery(`[${lower} ${upper}]`);
    }
    makeLowerString() {
        if (this.lower === Number.NEGATIVE_INFINITY)
            return '-inf';
        if (this.lowerExclusive)
            return `(${this.lower}`;
        return this.lower.toString();
    }
    makeUpperString() {
        if (this.upper === Number.POSITIVE_INFINITY)
            return '+inf';
        if (this.upperExclusive)
            return `(${this.upper}`;
        return this.upper.toString();
    }
}
exports.default = WhereNumber;
