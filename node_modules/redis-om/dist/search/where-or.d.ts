import Where from "./where";
export default class WhereOr extends Where {
    private left;
    private right;
    constructor(left: Where, right: Where);
    toString(): string;
}
