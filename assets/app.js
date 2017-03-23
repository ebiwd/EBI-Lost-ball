// var logo = project.importSVG(document.getElementById('ebi-svg'));
//
var canvasWidth = document.getElementById('ebi-oops').width;
//
//
// logo.position = new Point(canvasWidth / 2 - 100, 200);

var Engine = Matter.Engine,
    Render = Matter.Render,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create(),
    world = engine.world;

var render = Render.create({
		element: document.getElementById('ebi-oops'),
    options: {
        // width: cfg.w,
        // height: cfg.h,
        wireframes: false,
        background: '#fff'
    },
		engine: engine
		});


// stack.push(Bodies.circle(50, 50, 15, { restitution: 0.6, friction: 0.1 }));
var ball = function () {

    return Bodies.circle(50, 50, 15, {
        // density: 0.0005,
        // frictionAir: 0.06,
        restitution: 0.6,
        friction: 0.1,
        render: {
        }
    });
}

for (var i = 0; i < 20; i++) {
  World.add(engine.world, ball());
}

$('.add').on('click', function () {
    World.add(engine.world, ball());
})



// var ball = Bodies.circle(100, 150, 20, { render: { lineWidth: 1e-6, fillStyle: '#fA2'}, inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0});

var ground = Bodies.rectangle(0, 310, 910, 20, { render: { lineWidth: 1e-6, fillStyle: '#f42'}, isStatic: true});

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

World.add(world, [ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
