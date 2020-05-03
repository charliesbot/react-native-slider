type Args = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor({ x, y, width, height }: Args) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  containsPoint({ x, y }: Pick<Args, "x" | "y">) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.x + this.width &&
      y <= this.y + this.height
    );
  }
}

export { Rect };
