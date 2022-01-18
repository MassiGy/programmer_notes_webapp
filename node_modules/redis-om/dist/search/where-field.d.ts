import Entity from "../entity/entity";
import Search from "./search";
import Where from "./where";
interface WhereField<TEntity> extends Where {
    eq(value: string | number | boolean): Search<TEntity>;
    equal(value: string | number | boolean): Search<TEntity>;
    equals(value: string | number | boolean): Search<TEntity>;
    equalTo(value: string | number | boolean): Search<TEntity>;
    match(value: string): Search<TEntity>;
    matches(value: string): Search<TEntity>;
    matchExact(value: string): Search<TEntity>;
    matchExactly(value: string): Search<TEntity>;
    matchesExactly(value: string): Search<TEntity>;
    readonly exact: WhereField<TEntity>;
    readonly exactly: WhereField<TEntity>;
    true(): Search<TEntity>;
    false(): Search<TEntity>;
    gt(value: number): Search<TEntity>;
    greaterThan(value: number): Search<TEntity>;
    gte(value: number): Search<TEntity>;
    greaterThanOrEqualTo(value: number): Search<TEntity>;
    lt(value: number): Search<TEntity>;
    lessThan(value: number): Search<TEntity>;
    lte(value: number): Search<TEntity>;
    lessThanOrEqualTo(value: number): Search<TEntity>;
    between(lower: number, upper: number): Search<TEntity>;
    contain(value: string): Search<TEntity>;
    contains(value: string): Search<TEntity>;
    containOneOf(...value: string[]): Search<TEntity>;
    containsOneOf(...value: string[]): Search<TEntity>;
}
declare abstract class WhereField<TEntity extends Entity> {
    private negated;
    protected search: Search<TEntity>;
    protected field: String;
    constructor(search: Search<TEntity>, field: string);
    get is(): this;
    get does(): this;
    get not(): this;
    abstract toString(): string;
    protected negate(): void;
    protected buildQuery(valuePortion: string): string;
}
export default WhereField;
