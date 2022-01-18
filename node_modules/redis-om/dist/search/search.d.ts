import Schema from "../schema/schema";
import Client from "../client";
import Entity from '../entity/entity';
import WhereField from './where-field';
export declare type SubSearchFunction<TEntity extends Entity> = (search: Search<TEntity>) => Search<TEntity>;
export default class Search<TEntity extends Entity> {
    private schema;
    private client;
    private rootWhere?;
    constructor(schema: Schema<TEntity>, client: Client);
    get query(): string;
    get return(): Search<TEntity>;
    count(): Promise<number>;
    page(offset: number, count: number): Promise<TEntity[]>;
    all(options?: {
        pageSize: number;
    }): Promise<TEntity[]>;
    first(): Promise<TEntity>;
    returnCount(): Promise<number>;
    returnPage(offset: number, count: number): Promise<TEntity[]>;
    returnAll(options?: {
        pageSize: number;
    }): Promise<TEntity[]>;
    returnFirst(): Promise<TEntity>;
    where(field: string): WhereField<TEntity>;
    where(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
    and(field: string): WhereField<TEntity>;
    and(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
    or(field: string): WhereField<TEntity>;
    or(subSearchFn: SubSearchFunction<TEntity>): Search<TEntity>;
    private callSearch;
    private anyWhere;
    private anyWhereForField;
    private anyWhereForFunction;
    private createWhere;
}
