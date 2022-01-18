import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";
export default class WhereNumber<TEntity extends Entity> extends WhereField<TEntity> {
    private lower;
    private upper;
    private lowerExclusive;
    private upperExclusive;
    eq(value: number): Search<TEntity>;
    gt(value: number): Search<TEntity>;
    gte(value: number): Search<TEntity>;
    lt(value: number): Search<TEntity>;
    lte(value: number): Search<TEntity>;
    between(lower: number, upper: number): Search<TEntity>;
    equal(value: number): Search<TEntity>;
    equals(value: number): Search<TEntity>;
    equalTo(value: number): Search<TEntity>;
    greaterThan(value: number): Search<TEntity>;
    greaterThanOrEqualTo(value: number): Search<TEntity>;
    lessThan(value: number): Search<TEntity>;
    lessThanOrEqualTo(value: number): Search<TEntity>;
    toString(): string;
    private makeLowerString;
    private makeUpperString;
}
