import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";
export declare abstract class WhereBoolean<TEntity extends Entity> extends WhereField<TEntity> {
    protected value: boolean;
    eq(value: boolean): Search<TEntity>;
    equal(value: boolean): Search<TEntity>;
    equals(value: boolean): Search<TEntity>;
    equalTo(value: boolean): Search<TEntity>;
    true(): Search<TEntity>;
    false(): Search<TEntity>;
    abstract toString(): string;
}
export declare class WhereHashBoolean<TEntity extends Entity> extends WhereBoolean<TEntity> {
    toString(): string;
}
export declare class WhereJsonBoolean<TEntity extends Entity> extends WhereBoolean<TEntity> {
    toString(): string;
}
