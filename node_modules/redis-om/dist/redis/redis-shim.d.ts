export default class RedisShim {
    private redis;
    open(url: string): Promise<void>;
    close(): Promise<void>;
    execute<TResult>(command: string[]): Promise<TResult>;
    unlink(key: string): Promise<void>;
    hgetall(key: string): Promise<import("@node-redis/client/dist/lib/commands/generic-transformers").TuplesObject>;
    hsetall(key: string, data: {
        [key: string]: string;
    }): Promise<void>;
}
