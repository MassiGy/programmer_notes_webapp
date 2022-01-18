import Entity from "../entity/entity";
import Schema from "../schema/schema";
export declare abstract class SearchResultsConverter<TEntity extends Entity> {
    private results;
    protected schema: Schema<TEntity>;
    constructor(schema: Schema<TEntity>, results: any[]);
    get count(): number;
    get ids(): string[];
    get keys(): string[];
    get values(): any[];
    get entities(): TEntity[];
    protected abstract arrayToEntity(id: string, array: string[]): TEntity;
}
export declare class HashSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
    protected arrayToEntity(id: string, array: string[]): TEntity;
}
export declare class JsonSearchResultsConverter<TEntity extends Entity> extends SearchResultsConverter<TEntity> {
    protected arrayToEntity(id: string, array: string[]): TEntity;
}
