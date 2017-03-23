// var logo = project.importSVG(document.getElementById('ebi-svg'));
//
var canvasWidth = document.getElementById('ebi-oops').width;
//
//
// logo.position = new Point(canvasWidth / 2 - 100, 200);

var Engine = Matter.Engine,
    Render = Matter.Render,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

var ballsDeleted = 0;

var engine = Engine.create(),
    world = engine.world;

var render = Render.create({
		element: document.getElementById('ebi-oops'),
    options: {
        // width: canvasWidth,
        // height: 300,
        wireframes: false,
        background: 'none'
    },
		engine: engine
		});

    engine.world.gravity.x = .001;
    engine.world.gravity.y = .001;


function isEven(num) { return ((num % 2) === 1) ? 0 : 15 }
function calcBallX(activeColumn,circleSize,circleGap) {
  return activeColumn * (circleSize + circleGap) * 2;
}
function calcBallY(activeRow,circleSize,circleGap,activeColumn) {
  return (activeRow * (circleSize + circleGap+2) * 2) + isEven(activeColumn);
}

// stack.push(Bodies.circle(50, 50, 15, { restitution: 0.6, friction: 0.1 }));
var ball = function (activeColumn,activeRow,circleGap,circleSize) {

  var fillColor = '#6DAB49';
  var x = calcBallX(activeColumn,circleSize,circleGap);
  var y = calcBallY(activeRow,circleSize,circleGap,activeColumn);

  if (activeColumn == 3 && activeRow == 6) {
    fillColor = '#DA0F21';
  }

    return Bodies.circle(x, y, circleSize, {
        density: 0.0005,
        angle: 180,
        inertia: 1000,
        // frictionAir: 0.06,
        restitution: 0.6,
        friction: 0.1,
        render: {
           fillStyle: fillColor
          //  strokeStyle: 'blue',
          //  lineWidth: 3
        }
    });
}

function makeHexagon() {

  function blackBall(x,y) {
    var blackBalledCordinates=new Array(9);
    for (i=1; i <=9; i++) blackBalledCordinates[i]=new Array(2);

    blackBalledCordinates[1][1] = true;
    blackBalledCordinates[1][2] = true;
    // blackBalledCordinates[1][3] = true;
    // blackBalledCordinates[1][7] = true;
    blackBalledCordinates[1][8] = true;
    blackBalledCordinates[1][9] = true;
    blackBalledCordinates[2][1] = true;
    blackBalledCordinates[2][8] = true;
    blackBalledCordinates[2][9] = true;
    blackBalledCordinates[3][1] = true;
    // blackBalledCordinates[2][8] = true;
    blackBalledCordinates[3][9] = true;
    blackBalledCordinates[4][9] = true;
    blackBalledCordinates[6][9] = true;
    blackBalledCordinates[7][1] = true;
    blackBalledCordinates[7][9] = true;
    blackBalledCordinates[8][1] = true;
    // blackBalledCordinates[8][] = true;
    blackBalledCordinates[8][8] = true;
    blackBalledCordinates[8][9] = true;
    blackBalledCordinates[9][1] = true;
    blackBalledCordinates[9][2] = true;
    blackBalledCordinates[9][8] = true;
    blackBalledCordinates[9][9] = true;

    return blackBalledCordinates[x][y] || false;
  }

  var circleSize  = 15,
      circleGap   = Math.floor(circleSize / 5),
      columns     = 9,
      rows        = columns,
      redDotColum = 3,
      reDotRow    = 6;

  for (var activeColumn = 1; activeColumn <= columns; activeColumn++) {
    for (var activeRow = 1; activeRow <= rows; activeRow++) {
      if (blackBall(activeColumn,activeRow) === false) {
        // engine.world, ball(activeColumn,activeRow,circleGap,circleSize)
        var newBall = ball(activeColumn,activeRow,circleGap,circleSize);
        World.add(world, [
          newBall,
          Constraint.create({
            bodyA: newBall,
            pointB: { x: calcBallX(activeColumn,circleSize,circleGap), y: calcBallY(activeRow,circleSize,circleGap,activeColumn) },
            render: {
              //  fillStyle: fillColor
               strokeStyle: 'none',
               lineWidth: 0
            }

           })
          ]
        );
      }
    }
  }

}

makeHexagon();

var createBalls = setInterval(function(){
  // engine.enabled = false
  if (Matter.Composite.allBodies(engine.world).length > 90) {
    // pause
    Render.stop(render);
    // show message "you're not even trying! Delete a few balls to proceed"
  } else {
    // resume
    Render.run(render);
    var clickBall = ball(3,6,Matter.Common.random(2,8),15);
      World.add(engine.world, clickBall);
  }
}, 500);


$('#ebi-oops').on('click', function () {
// console.log(mouse.position.x,mouse.position.y);

    var selected = Matter.Query.point(Matter.Composite.allBodies(engine.world),{x:mouse.position.x,y:mouse.position.y});
    Matter.World.remove(engine.world, [selected[0]]);

    ballsDeleted++;
    console.log(ballsDeleted);
    // $(clickBall).on(_engine, 'mousedown', function(event) {
    //   console.log('test');
    // });
})



// var ball = Bodies.circle(100, 150, 20, { render: { lineWidth: 1e-6, fillStyle: '#fA2'}, inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0});

var ground = Bodies.rectangle(0, 410, 1710, 10, { render: { lineWidth: 1e-6, fillStyle: '#fff'}, isStatic: true});
var left = Bodies.rectangle(0, 0, 20, 800, { render: { lineWidth: 1e-6, fillStyle: '#fff'}, isStatic: true});
var right = Bodies.rectangle(800, 0, 20, 800, { render: { lineWidth: 1e-6, fillStyle: '#fff'}, isStatic: true});

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

World.add(world, [ground,left,right]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
