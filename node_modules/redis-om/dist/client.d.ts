import Entity from './entity/entity';
import Repository from './repository/repository';
import Schema from './schema/schema';
export declare type HashData = {
    [key: string]: any;
};
export declare type JsonData = {
    [key: string]: any;
};
export declare type SearchDataStructure = 'HASH' | 'JSON';
export declare type CreateIndexOptions = {
    indexName: string;
    dataStructure: SearchDataStructure;
    prefix: string;
    schema: string[];
    stopWords?: string[];
};
export declare type SearchOptions = {
    indexName: string;
    query: string;
    offset: number;
    count: number;
};
export default class Client {
    private shim?;
    open(url?: string): Promise<void>;
    execute<TResult>(command: (string | number | boolean)[]): Promise<TResult>;
    fetchRepository<TEntity extends Entity>(schema: Schema<TEntity>): Repository<TEntity>;
    close(): Promise<void>;
    createIndex(options: CreateIndexOptions): Promise<void>;
    dropIndex(indexName: string): Promise<void>;
    search(options: SearchOptions): Promise<any[]>;
    unlink(key: string): Promise<void>;
    hgetall(key: string): Promise<HashData>;
    hsetall(key: string, data: HashData): Promise<void>;
    jsonget(key: string): Promise<JsonData>;
    jsonset(key: string, data: JsonData): Promise<void>;
    isOpen(): boolean;
    private validateShimOpen;
}
