"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereField {
    constructor(search, field) {
        this.negated = false;
        this.search = search;
        this.field = field;
    }
    get is() {
        return this;
    }
    get does() {
        return this;
    }
    get not() {
        this.negate();
        return this;
    }
    negate() {
        this.negated = !this.negated;
    }
    buildQuery(valuePortion) {
        let negationPortion = this.negated ? '-' : '';
        let fieldPortion = this.field;
        return `(${negationPortion}@${fieldPortion}:${valuePortion})`;
    }
}
exports.default = WhereField;
