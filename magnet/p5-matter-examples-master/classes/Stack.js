
class Stack extends Block {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  addBody() {
    this.body = Matter.Composites.stack(this.attributes.x, this.attributes.y, this.attributes.cols, this.attributes.rows, this.attributes.colGap, this.attributes.rowGap, this.attributes.create);
    for (let body of this.body.bodies) {
      body.plugin = this.options.plugin;
    }
  }
}
