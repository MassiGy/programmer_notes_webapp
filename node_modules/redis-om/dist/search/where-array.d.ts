import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";
export default class WhereArray<TEntity extends Entity> extends WhereField<TEntity> {
    private value;
    contain(value: string): Search<TEntity>;
    contains(value: string): Search<TEntity>;
    containsOneOf(...value: string[]): Search<TEntity>;
    containOneOf(...value: string[]): Search<TEntity>;
    toString(): string;
}
