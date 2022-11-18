// Matter modules
const {
  Render,
  Runner,
  Engine,
  Bodies,
  Composite,
  Composites,
  Constraint,
  Mouse,
  MouseConstraint,
  Events,
  Body,
} = Matter;

// Bird specs
const { name, posX, posY, radius, physics, grow, maxGrow } = getRandomBird();
characterName.textContent = name;

// Game distribution
const gameSize = { w: window.innerWidth, h: window.innerHeight };
const baseProps = {
  w: 150,
  h: 20,
  posX: gameSize.w - 300,
  posY: gameSize.h - 200,
};
const bricksProps = {
  w: baseProps.w / 5,
  h: 30,
  posX: baseProps.posX - baseProps.w / 2,
  posY: 50,
  cols: 5,
  rows: 10,
};

const engine = Engine.create();
const render = Render.create({
  element: document.body,
  engine,
  options: { width: gameSize.w, height: gameSize.h },
});

const base = Bodies.rectangle(
  baseProps.posX,
  baseProps.posY,
  baseProps.w,
  baseProps.h,
  { isStatic: true }
);

const bricks = Composites.stack(
  bricksProps.posX,
  bricksProps.posY,
  bricksProps.cols,
  bricksProps.rows,
  0,
  0,
  (x, y) => {
    return Bodies.rectangle(x, y, bricksProps.w, bricksProps.h);
  }
);

const bird = Bodies.circle(posX, posY, radius, physics);

const shooter = Constraint.create({
  pointA: { x: posX, y: posY },
  bodyB: bird,
});

const mouse = Mouse.create(render.canvas);
const mouseContraint = MouseConstraint.create(engine, { mouse });

let isFiring = false;
Events.on(mouseContraint, "enddrag", () => (isFiring = true));
Events.on(engine, "afterUpdate", () => {
  if (isFiring) {
    Composite.remove(engine.world, shooter, true);

    if (grow && bird.circleRadius < maxGrow) {
      Body.scale(bird, grow, grow);
    }
  }

  score.textContent = bricks.bodies.filter(
    (elm) => elm.position.y > gameSize.h
  ).length;
});

Composite.add(engine.world, [base, bricks, bird, shooter, mouseContraint]);

Runner.run(engine);
Render.run(render);
