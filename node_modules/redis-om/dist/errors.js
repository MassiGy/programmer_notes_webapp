"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RedisError';
    }
}
exports.default = RedisError;
