import Where from "./where";
export default class WhereAnd extends Where {
    private left;
    private right;
    constructor(left: Where, right: Where);
    toString(): string;
}
