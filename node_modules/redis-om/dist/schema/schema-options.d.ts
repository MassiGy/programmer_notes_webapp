import { SearchDataStructure } from "../client";
import { IdStrategy, StopWordOptions } from "./schema-definitions";
export declare type SchemaOptions = {
    prefix?: string;
    indexName?: string;
    dataStructure?: SearchDataStructure;
    idStrategy?: IdStrategy;
    useStopWords?: StopWordOptions;
    stopWords?: string[];
};
