/*

a tile has an id representing which type it is

the type has a unique ID, a number.  it also has a list of sides with numbers.
adjacent sides of tiles must match.  we can ensure this by placing a tile, then
for each side, find another tile to place next to it that matches. If no such
tile is available then we put -1 which means invalid.  0 means no tile has been assigned yet.

let's start with a datastructure to represent a grid of tiles so we can see them.

great. now let's set one tile in the middle.

how are we going to represent these little pixel tiles? let's consider a pipe. We have
three types. A horizontal one, a vertical one, or a cross, meaning it goes both horizontal
and vertical.  So we have types: A, B, and C.

A tile can be described as having four edges, starting at the top and going clockwise. where
 the number 0 means there is nothing there and the number 1 means it is an open pipe.  If A is
 the horizontal pipe then it's edges are 0,1,0,1.

A = [0,1,0,1] // horizontal pipe
B = [1,0,1,0] // vertical pipe
C = [1,1,1,1] // cross pipe


*/

const PRINT_COORDS = false;
const PRINT_GRID = false;
const UNSET = 0;
const INVALID = -1;
const TILE_A = 1;
const TILE_B = 2;
const TILE_C = 3;

let A = {id:1, edges:[0,1,0,1]};
let B = {id:2, edges:[1,0,1,0]};
let C = {id:3, edges:[1,1,1,1]};
const TILES = [A,B,C]


const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

class Grid {
  constructor() {
    this.width = 10;
    this.height = 10;
    this.tiles = []
    for(let i=0; i<this.width*this.height; i++) {
      this.tiles[i] = UNSET;
    }
  }

  get_at(i,j) {
    if (j < 0 || j >= this.height ) return INVALID;
    if (i < 0 || i >= this.width)  return INVALID;
    return this.tiles[j*this.width + i];
  }
  set_at(i,j,v) {
    this.tiles[j*this.width + i] = v;
  }

  draw(canvas) {
    let size = 60;

    let ctx = canvas.getContext('2d');
    if (PRINT_GRID) {
      ctx.fillStyle = 'blue';
    } else {
      ctx.fillStyle = 'white';
    }
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let tile = this.get_at(i, j);
        let color = 'white';
        if (tile === UNSET) color = 'lightgrey';
        if (tile === INVALID) color = 'darkgrey';
        ctx.fillStyle = color;
        ctx.fillRect(i * size, j * size, size - 1, size - 1);

        if (tile.id) {
          ctx.fillStyle = 'black';
          if (tile.edges[0] === 1) ctx.fillRect((i+0.4)*size,j*size,size*0.2,size*0.5);
          if (tile.edges[2] === 1) ctx.fillRect((i+0.4)*size,(j+0.5)*size,size*0.2,size*0.5);
          if (tile.edges[1] === 1) ctx.fillRect((i+0.5)*size,(j+0.4)*size,size*0.5,size*0.2);
          if (tile.edges[3] === 1) ctx.fillRect((i+0.0)*size,(j+0.4)*size,size*0.5,size*0.2);
        }

        if(PRINT_COORDS) {
          ctx.font = "12pt serif";
          ctx.fillStyle = 'red';
          ctx.fillText(i + "," + j, (i + 0.5) * size, (j + 0.5) * size);
        }
      }
    }
  }
}



function init() {
  let canvas = document.createElement('canvas')
  canvas.width = 600;
  canvas.height = 600;
  document.body.appendChild(canvas);


  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,600,600);

  let grid = new Grid();

  // get the current cell

  function calc_tile(x,y, e1, e2) {
    let current = grid.get_at(x,y);
    let edge = current.edges[e1];
    let options = TILES.filter(t => t.edges[e2] === edge);
    return pick(options);
  }

  function find_tile(x,y) {
    let center = grid.get_at(x,y);
    //return if already set
    if(center !== UNSET) return center;

    let sides = [[0,-1, 0], [1,0, 1], [0,1, 2], [-1,0, 3]]
    let constraints = []
    sides.forEach(xy => {
      let cell = grid.get_at(x+xy[0],y+xy[1])
      if (cell !== UNSET && cell !== INVALID) constraints.push([xy[2],cell,'name'])
    })
    let options = TILES;
    for (c of constraints) {
      let side = c[0];
      let oppo = (side + 2) % 4;
      options = options.filter(t => t.edges[side] === c[1].edges[oppo])
    }
    if (options.length <= 0) {
      return INVALID;
    } else {
      return pick(options);
    }
  }


  function do_adjacent(x,y, depth) {
    let center = grid.get_at(x,y);
    if (center === INVALID) return
    if (center === UNSET)  return console.log("not set yet",x,y)

    grid.set_at(x-1,y,find_tile(x-1,y));
    grid.set_at(x+1,y,find_tile(x+1,y));
    grid.set_at(x+0,y-1,find_tile(x+0,y-1));
    grid.set_at(x+0,y+1,find_tile(x+0,y+1));

    if (depth > 0) {
      // go right
      do_adjacent(x+1,y, depth-1)
      do_adjacent(x-1,y, depth-1); // go left
      do_adjacent(x+0,y-1,depth-1) // go up
      do_adjacent(x+0,y+1,depth-1) // go up
    }
  }

  //set a random tile for the start
  // grid.set_at(6,4,pick(TILES));
  grid.set_at(1,1,pick(TILES));
  do_adjacent(1,1, 10);







  grid.draw(canvas);
}


init();



