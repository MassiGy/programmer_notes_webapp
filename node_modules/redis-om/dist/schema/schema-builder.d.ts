import Entity from "../entity/entity";
import Schema from "./schema";
export default class SchemaBuilder<TEntity extends Entity> {
    private schema;
    constructor(schema: Schema<TEntity>);
    get redisSchema(): string[];
    private buildHashSchema;
    private buildJsonSchema;
    private buildHashSchemaEntry;
    private buildJsonSchemaEntry;
}
