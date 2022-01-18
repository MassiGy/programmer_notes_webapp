import { EntityData } from '../entity/entity';
import { SchemaDefinition } from "../schema/schema-definitions";
import { HashData } from '../client';
export default class HashConverter {
    private schemaDef;
    constructor(schemaDef: SchemaDefinition);
    toHashData(entityData: EntityData): HashData;
    toEntityData(hashData: HashData): EntityData;
    private addNumber;
    private addBoolean;
    private addArray;
    private addString;
}
