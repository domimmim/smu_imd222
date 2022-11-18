

class Magnet extends Ball {

  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.attracted = [];
    this.isActive = this.attributes.attraction;
  }

  addAttracted(obj) {
    if (obj.length) {
      this.attracted = this.attracted.concat(obj);
    } else {
      this.attracted.push(obj);
    }
  }

  attract() {
    if (this.isActive) {
      this.attracted.forEach(obj => {
        if (obj.body) {
          obj = obj.body;
        }
        let force = {
          x: (this.body.position.x - obj.position.x),
          y: (this.body.position.y - obj.position.y)
        }
        Matter.Body.applyForce(obj, obj.position, Matter.Vector.mult(force, this.attributes.attraction));
      })
    }
  }

  gravity() {
    if (this.isActive) {
      this.attracted.forEach(obj => {
        if (obj.body) {
          obj = obj.body;
        }
        let bToA = Matter.Vector.sub(obj.position, this.body.position);
        let distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001;
        let normal = Matter.Vector.normalise(bToA);
        let magnitude = -this.attributes.attraction * (this.body.mass * obj.mass / distanceSq);
        let force = Matter.Vector.mult(normal, magnitude);
        Matter.Body.applyForce(obj, obj.position, force);
      })
    }
  }
}
