"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_shim_1 = __importDefault(require("./redis/redis-shim"));
const repository_1 = __importDefault(require("./repository/repository"));
const errors_1 = __importDefault(require("./errors"));
class Client {
    async open(url = 'redis://localhost:6379') {
        var _a;
        let shim = (_a = this.shim) !== null && _a !== void 0 ? _a : new redis_shim_1.default();
        await shim.open(url);
        this.shim = shim;
    }
    async execute(command) {
        this.validateShimOpen();
        return await this.shim.execute(command.map(arg => {
            if (arg === false)
                return '0';
            if (arg === true)
                return '1';
            return arg.toString();
        }));
    }
    fetchRepository(schema) {
        this.validateShimOpen();
        return new repository_1.default(schema, this);
    }
    async close() {
        var _a;
        await ((_a = this.shim) === null || _a === void 0 ? void 0 : _a.close());
        this.shim = undefined;
    }
    async createIndex(options) {
        this.validateShimOpen();
        let { indexName, dataStructure, prefix, schema, stopWords } = options;
        let command = [
            'FT.CREATE', indexName,
            'ON', dataStructure,
            'PREFIX', '1', `${prefix}`
        ];
        if (stopWords !== undefined)
            command.push('STOPWORDS', `${stopWords.length}`, ...stopWords);
        command.push('SCHEMA', ...schema);
        await this.shim.execute(command);
    }
    async dropIndex(indexName) {
        this.validateShimOpen();
        await this.shim.execute(['FT.DROPINDEX', indexName]);
    }
    async search(options) {
        this.validateShimOpen();
        let { indexName, query, offset, count } = options;
        return await this.shim.execute([
            'FT.SEARCH', indexName, query,
            'LIMIT', offset.toString(), count.toString()
        ]);
    }
    async unlink(key) {
        this.validateShimOpen();
        await this.shim.unlink(key);
    }
    async hgetall(key) {
        this.validateShimOpen();
        return await this.shim.hgetall(key);
    }
    async hsetall(key, data) {
        this.validateShimOpen();
        await this.shim.hsetall(key, data);
    }
    async jsonget(key) {
        this.validateShimOpen();
        let json = await this.shim.execute(['JSON.GET', key, '.']);
        return JSON.parse(json);
    }
    async jsonset(key, data) {
        this.validateShimOpen();
        let json = JSON.stringify(data);
        await this.shim.execute(['JSON.SET', key, '.', json]);
    }
    isOpen() {
        return !!this.shim;
    }
    validateShimOpen() {
        if (!this.shim)
            throw new errors_1.default("Redis connection needs opened.");
    }
}
exports.default = Client;
