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
    return this.tiles[j*this.width + i];
  }
  set_at(i,j,v) {
    this.tiles[j*this.width + i] = v;
  }

  draw(canvas) {
    let cw = canvas.width;
    let ch = canvas.height;
    let size = 60;

    let ctx = canvas.getContext('2d');
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let tile = this.get_at(i, j);
        let color = 'white';
        if (tile === UNSET) color = 'lightgrey';
        ctx.fillStyle = color;
        ctx.fillRect(i * size, j * size, size - 1, size - 1);

        if (tile.id) {
          ctx.fillStyle = 'black';
          if (tile.edges[0] === 1) ctx.fillRect((i+0.4)*size,j*size,size*0.2,size*0.5);
          if (tile.edges[2] === 1) ctx.fillRect((i+0.4)*size,(j+0.5)*size,size*0.2,size*0.5);
          if (tile.edges[1] === 1) ctx.fillRect((i+0.5)*size,(j+0.4)*size,size*0.5,size*0.2);
          if (tile.edges[3] === 1) ctx.fillRect((i+0.0)*size,(j+0.4)*size,size*0.5,size*0.2);
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

  function calc_right(current) {
    let right_edge = current.edges[1];
    // if right edge is 1 then the left edge of the next must be 1, which is either A or C
    let options = TILES.filter(t => t.edges[3] === right_edge);
    return pick(options);
  }
  function calc_left(current) {
    let edge = current.edges[3];
    let options = TILES.filter(t => t.edges[1] === edge);
    return pick(options);
  }

  function calc_tile(current, e1, e2) {
    let edge = current.edges[e1];
    let options = TILES.filter(t => t.edges[e2] === edge);
    return pick(options);
  }


  function do_adjacent(x,y, depth) {
    let center = grid.get_at(x,y);
    if (center === INVALID) {
      return console.log("got to an edge of the board",x,y);
    }
    if (center === UNSET) {
      return console.log("not set yet",x,y);
    }
    let left = grid.get_at(x-1,y);
    if (left === UNSET) grid.set_at(x-1,y, calc_tile(center,3,1));
    let right = grid.get_at(x+1,y);
    if (right === UNSET) grid.set_at(x+1,y, calc_tile(center,1,3));
    let top = grid.get_at(x+0,y-1);
    if (top === UNSET) grid.set_at(x+0,y-1, calc_tile(center,0,2));
    let bot = grid.get_at(x+0,y+1);
    if (bot === UNSET) grid.set_at(x+0,y+1, calc_tile(center,2,0));

    if (depth > 0) {
      // go right
      do_adjacent(x+1,y, depth-1)
      do_adjacent(x-1,y, depth-1); // go left
      do_adjacent(x+0,y-1,depth-1) // go up
      do_adjacent(x+0,y+1,depth-1) // go up
    }
  }

  //set a random tile for the start
  grid.set_at(5,5,pick(TILES));
  do_adjacent(5,5, 2);


  // grid.set_at(6,5,next)







  grid.draw(canvas);
}


init();


