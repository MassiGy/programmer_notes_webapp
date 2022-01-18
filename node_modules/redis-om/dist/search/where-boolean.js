"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereJsonBoolean = exports.WhereHashBoolean = exports.WhereBoolean = void 0;
const where_field_1 = __importDefault(require("./where-field"));
class WhereBoolean extends where_field_1.default {
    eq(value) {
        this.value = value;
        return this.search;
    }
    equal(value) { return this.eq(value); }
    equals(value) { return this.eq(value); }
    equalTo(value) { return this.eq(value); }
    true() { return this.eq(true); }
    false() { return this.eq(false); }
}
exports.WhereBoolean = WhereBoolean;
class WhereHashBoolean extends WhereBoolean {
    toString() {
        return this.buildQuery(`{${this.value ? '1' : '0'}}`);
    }
}
exports.WhereHashBoolean = WhereHashBoolean;
class WhereJsonBoolean extends WhereBoolean {
    toString() {
        return this.buildQuery(`{${this.value}}`);
    }
}
exports.WhereJsonBoolean = WhereJsonBoolean;
