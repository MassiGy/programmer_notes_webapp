import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";
export default class WhereText<TEntity extends Entity> extends WhereField<TEntity> {
    private value;
    private exactValue;
    match(value: string): Search<TEntity>;
    matchExact(value: string): Search<TEntity>;
    matches(value: string): Search<TEntity>;
    matchExactly(value: string): Search<TEntity>;
    matchesExactly(value: string): Search<TEntity>;
    get exact(): this;
    get exactly(): this;
    toString(): string;
}
