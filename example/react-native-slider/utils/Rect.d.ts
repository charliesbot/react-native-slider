declare type Args = {
    x: number;
    y: number;
    width: number;
    height: number;
};
declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor({ x, y, width, height }: Args);
    containsPoint({ x, y }: Pick<Args, "x" | "y">): boolean;
}
export { Rect };
