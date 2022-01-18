"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSearchResultsConverter = exports.HashSearchResultsConverter = exports.SearchResultsConverter = void 0;
const hash_converter_1 = __importDefault(require("../repository/hash-converter"));
const json_converter_1 = __importDefault(require("../repository/json-converter"));
class SearchResultsConverter {
    constructor(schema, results) {
        this.schema = schema;
        this.results = results;
    }
    get count() {
        let [count] = this.results;
        return Number.parseInt(count);
    }
    get ids() {
        return this.keys.map(key => key.replace(/^.*:/, ""));
    }
    get keys() {
        let [_count, ...keysAndValues] = this.results;
        return keysAndValues.filter((_entry, index) => index % 2 === 0);
    }
    get values() {
        let [_count, ...keysAndValues] = this.results;
        return keysAndValues.filter((_entry, index) => index % 2 !== 0);
    }
    get entities() {
        let ids = this.ids;
        let values = this.values;
        return values.map((array, index) => this.arrayToEntity(ids[index], array));
    }
}
exports.SearchResultsConverter = SearchResultsConverter;
class HashSearchResultsConverter extends SearchResultsConverter {
    arrayToEntity(id, array) {
        let keys = array.filter((_entry, index) => index % 2 === 0);
        let values = array.filter((_entry, index) => index % 2 !== 0);
        let hashData = keys.reduce((object, key, index) => {
            object[key] = values[index];
            return object;
        }, {});
        let converter = new hash_converter_1.default(this.schema.definition);
        let entityData = converter.toEntityData(hashData);
        return new this.schema.entityCtor(this.schema.definition, id, entityData);
    }
}
exports.HashSearchResultsConverter = HashSearchResultsConverter;
class JsonSearchResultsConverter extends SearchResultsConverter {
    arrayToEntity(id, array) {
        let jsonString = array[1];
        let jsonData = JSON.parse(jsonString);
        let converter = new json_converter_1.default(this.schema.definition);
        let entityData = converter.toEntityData(jsonData);
        return new this.schema.entityCtor(this.schema.definition, id, entityData);
    }
}
exports.JsonSearchResultsConverter = JsonSearchResultsConverter;
