"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const where_and_1 = __importDefault(require("./where-and"));
const where_or_1 = __importDefault(require("./where-or"));
const where_array_1 = __importDefault(require("./where-array"));
const where_boolean_1 = require("./where-boolean");
const where_number_1 = __importDefault(require("./where-number"));
const where_string_1 = __importDefault(require("./where-string"));
const where_text_1 = __importDefault(require("./where-text"));
const results_converter_1 = require("./results-converter");
const __1 = require("..");
class Search {
    constructor(schema, client) {
        this.schema = schema;
        this.client = client;
    }
    get query() {
        if (this.rootWhere === undefined)
            return '*';
        return `${this.rootWhere.toString()}`;
    }
    get return() {
        return this;
    }
    async count() {
        let searchResults = await this.callSearch();
        return this.schema.dataStructure === 'JSON'
            ? new results_converter_1.JsonSearchResultsConverter(this.schema, searchResults).count
            : new results_converter_1.HashSearchResultsConverter(this.schema, searchResults).count;
    }
    async page(offset, count) {
        let searchResults = await this.callSearch(offset, count);
        return this.schema.dataStructure === 'JSON'
            ? new results_converter_1.JsonSearchResultsConverter(this.schema, searchResults).entities
            : new results_converter_1.HashSearchResultsConverter(this.schema, searchResults).entities;
    }
    async all(options = { pageSize: 10 }) {
        let entities = [];
        let offset = 0;
        let pageSize = options.pageSize;
        while (true) {
            let foundEntities = await this.page(offset, pageSize);
            entities.push(...foundEntities);
            if (foundEntities.length < pageSize)
                break;
            offset += pageSize;
        }
        return entities;
    }
    async first() {
        var _a;
        let foundEntity = await this.page(0, 1);
        return (_a = foundEntity[0]) !== null && _a !== void 0 ? _a : null;
    }
    async returnCount() {
        return await this.count();
    }
    async returnPage(offset, count) {
        return await this.page(offset, count);
    }
    async returnAll(options = { pageSize: 10 }) {
        return await this.all(options);
    }
    async returnFirst() {
        return await this.first();
    }
    where(fieldOrFn) {
        return this.anyWhere(where_and_1.default, fieldOrFn);
    }
    and(fieldOrFn) {
        return this.anyWhere(where_and_1.default, fieldOrFn);
    }
    or(fieldOrFn) {
        return this.anyWhere(where_or_1.default, fieldOrFn);
    }
    async callSearch(offset = 0, count = 0) {
        let options = {
            indexName: this.schema.indexName,
            query: this.query,
            offset,
            count
        };
        let searchResults;
        try {
            searchResults = await this.client.search(options);
        }
        catch (error) {
            let message = error.message;
            if (message.startsWith("Syntax error")) {
                throw new __1.RedisError(`The query to RediSearch had a syntax error: "${message}".\nThis is often the result of using a stop word in the query. Either change the query to not use a stop word or change the stop words in the schema definition. You can check the RediSearch source for the default stop words at: https://github.com/RediSearch/RediSearch/blob/master/src/stopwords.h.`);
            }
            throw error;
        }
        return searchResults;
    }
    anyWhere(ctor, fieldOrFn) {
        if (typeof fieldOrFn === 'string') {
            return this.anyWhereForField(ctor, fieldOrFn);
        }
        else {
            return this.anyWhereForFunction(ctor, fieldOrFn);
        }
    }
    anyWhereForField(ctor, field) {
        let where = this.createWhere(field);
        if (this.rootWhere === undefined) {
            this.rootWhere = where;
        }
        else {
            this.rootWhere = new ctor(this.rootWhere, where);
        }
        return where;
    }
    anyWhereForFunction(ctor, subSearchFn) {
        let search = new Search(this.schema, this.client);
        let subSearch = subSearchFn(search);
        if (subSearch.rootWhere === undefined) {
            throw new Error("Sub-search without and root where was somehow defined.");
        }
        else {
            if (this.rootWhere === undefined) {
                this.rootWhere = subSearch.rootWhere;
            }
            else {
                this.rootWhere = new ctor(this.rootWhere, subSearch.rootWhere);
            }
        }
        return this;
    }
    createWhere(field) {
        let fieldDef = this.schema.definition[field];
        if (fieldDef === undefined)
            throw new Error(`The field '${field}' is not part of the schema.`);
        if (fieldDef.type === 'array')
            return new where_array_1.default(this, field);
        if (fieldDef.type === 'boolean' && this.schema.dataStructure === 'HASH')
            return new where_boolean_1.WhereHashBoolean(this, field);
        if (fieldDef.type === 'boolean' && this.schema.dataStructure === 'JSON')
            return new where_boolean_1.WhereJsonBoolean(this, field);
        if (fieldDef.type === 'number')
            return new where_number_1.default(this, field);
        if (fieldDef.type === 'string' && fieldDef.textSearch === true)
            return new where_text_1.default(this, field);
        if (fieldDef.type === 'string' && fieldDef.textSearch !== true)
            return new where_string_1.default(this, field);
        throw new Error(`The field type of '${fieldDef.type}' is not a valid field type. Valid types include 'array', 'boolean', 'number', and 'string'.`);
    }
}
exports.default = Search;
