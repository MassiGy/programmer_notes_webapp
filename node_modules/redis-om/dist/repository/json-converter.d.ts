import { JsonData } from "../client";
import { EntityData } from '../entity/entity';
import { SchemaDefinition } from "../schema/schema-definitions";
export default class JsonConverter {
    private schemaDef;
    constructor(schemaDef: SchemaDefinition);
    toJsonData(entityData: EntityData): JsonData;
    toEntityData(jsonData: JsonData): EntityData;
}
