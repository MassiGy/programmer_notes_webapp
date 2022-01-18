"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@node-redis/client");
const errors_1 = __importDefault(require("../errors"));
class RedisShim {
    async open(url) {
        this.redis = (0, client_1.createClient)({ url });
        await this.redis.connect();
    }
    async close() {
        await this.redis.quit();
    }
    execute(command) {
        return this.redis.sendCommand(command);
    }
    async unlink(key) {
        await this.redis.unlink(key);
    }
    hgetall(key) {
        return this.redis.hGetAll(key);
    }
    async hsetall(key, data) {
        try {
            await this.redis.executeIsolated(async (isolatedClient) => {
                await isolatedClient.watch(key);
                await isolatedClient
                    .multi()
                    .unlink(key)
                    .hSet(key, data)
                    .exec();
            });
        }
        catch (error) {
            if (error.name === 'WatchError')
                throw new errors_1.default("Watch error when setting HASH.");
            throw error;
        }
    }
}
exports.default = RedisShim;
