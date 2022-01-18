import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";
export default class WhereString<TEntity extends Entity> extends WhereField<TEntity> {
    private value;
    eq(value: string): Search<TEntity>;
    equal(value: string): Search<TEntity>;
    equals(value: string): Search<TEntity>;
    equalTo(value: string): Search<TEntity>;
    toString(): string;
}
