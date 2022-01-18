import { SearchDataStructure } from '../client';
import Entity from "../entity/entity";
import { EntityConstructor } from '../entity/entity';
import { SchemaDefinition, StopWordOptions } from './schema-definitions';
import { SchemaOptions } from './schema-options';
export default class Schema<TEntity extends Entity> {
    readonly entityCtor: EntityConstructor<TEntity>;
    readonly definition: SchemaDefinition;
    private options?;
    constructor(ctor: EntityConstructor<TEntity>, schemaDef: SchemaDefinition, options?: SchemaOptions);
    get prefix(): string;
    get indexName(): string;
    get dataStructure(): SearchDataStructure;
    get useStopWords(): StopWordOptions;
    get stopWords(): string[];
    get redisSchema(): string[];
    generateId(): string;
    private defineProperties;
    private validateOptions;
    private validateFieldDef;
}
