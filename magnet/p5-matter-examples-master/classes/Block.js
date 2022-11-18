

class Block extends BlockCore {
  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.collisions = [];
    this.constraints = [];
    this.offset = this.attributes.offset || { x: 0, y: 0 };
    this.attributes.scale = this.attributes.scale || 1.0;
  }

  draw() {
    if (this.body) {
      this.update();
      if (this.attributes.color || this.attributes.stroke) {
        super.draw();
      }
      if (this.attributes.image) {
        this.drawSprite();
      }
      if (this.constraints.length > 0) {
        for (let c of this.constraints) {
          if (c.draw === true) this.drawConstraint(c);
        }
      }
    }
  }

  drawConstraints() {
    if (this.constraints.length > 0) {
      for (let c of this.constraints) {
        this.drawConstraint(c);
      }
    }
  }

  drawConstraint(constraint) {
    if (constraint.color) {
      stroke(constraint.color);
    } else {
      stroke("magenta");
    }
    strokeWeight(2);
    const offsetA = constraint.pointA;
    let posA = {
      x: 0,
      y: 0
    };
    if (constraint.bodyA) {
      posA = constraint.bodyA.position;
    }
    const offsetB = constraint.pointB;
    let posB = {
      x: 0,
      y: 0
    };
    if (constraint.bodyB) {
      posB = constraint.bodyB.position;
    }
    line(
      posA.x + offsetA.x,
      posA.y + offsetA.y,
      posB.x + offsetB.x,
      posB.y + offsetB.y
    );
  }

  update() {
    this.collisions.forEach(block => {
      if (block.attributes.force) {
        Matter.Body.applyForce(this.body, this.body.position, block.attributes.force);
      }
      if (block.attributes.trigger) {
        block.attributes.trigger(this, block);
      }
    });
    this.collisions = [];
  }

  constrainTo(block, options) {
    options.bodyA = this.body;
    if (block) {
      // constrain to another block
      if (!options.bodyB) {
        options.bodyB = block.body;
      }
    } else {
      // constrain to "background" scene
      if (!options.pointB) {
        options.pointB = {
          x: this.body.position.x,
          y: this.body.position.y
        };
      }
    }
    const contraint = Matter.Constraint.create(options);
    this.constraints.push(contraint);
    Matter.World.add(this.world, contraint);
    return contraint;
  }


  collideWith(block) {
    if (block) {
      this.collisions.push(block);
    }
  }


  drawSprite() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.attributes.image, this.offset.x, this.offset.y, this.attributes.image.width * this.attributes.scale, this.attributes.image.height * this.attributes.scale);
    pop();
  }

}
