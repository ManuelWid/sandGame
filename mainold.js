import { Particle } from "./class/Particle.js";
// import { random, drawGrid } from "./utils/utils.js";

// FPS display
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// options
const cw = 500;
const ch = 500;
const cols = 250;
const rows = cols;
const cell_w = cw/cols;
const cell_h = ch/rows;

let cells = initArray(cols, rows);
let particle_interval_id;
const particle_interval = 100;
const particle_amount = 30; // amout of particles generated on click, squared e.g. 5 means a 5x5 area
let particle_type = "sand";

// holds mouse coordinates in cells of the canvas/array, x:0, y:0 would be top left cell
const mouse = {
    x: 0,
    y: 0
}

const canvas = document.getElementById("canvas");
canvas.width = cw;
canvas.height = ch;
const ctx = canvas.getContext("2d");

let cell_amount = 0;

function draw(){
    stats.begin();
    cell_amount = 0;

    // copy current array to make changes, avoids interference while looping
    const new_frame = prepareNewFrame(cells);

    // clear canvas
    ctx.reset();

    // loop cell array and draw them to canvas
    for(let col = 0; col < cols; col++){
        for(let row = 0; row < rows; row++){
            const currentCell = cells[col][row];
            if(currentCell === 0) continue;
            cell_amount++;
            // if(currentCell.falling > 0) continue;
            
            ctx.fillStyle = currentCell.color;
            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);

            // collision
            if(cells[col][row+1] === 0){
                new_frame[col][row+1] = currentCell;
                new_frame[col][row] = 0;

                // ctx.clearRect(col * cell_w, (row-1) * cell_h, cell_w, cell_h)
                // ctx.fillStyle = currentCell.color;
                // ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);
            }
            else{
                const bottom_left_empty = cells[col-1] && cells[col-1][row+1] === 0;
                const bottom_right_empty = cells[col+1] && cells[col+1][row+1] === 0;
                const both_empty = bottom_left_empty && bottom_right_empty;
                
                if(both_empty){
                    const sign = Math.sign(Math.random() - 0.5);
                    new_frame[col+sign][row] = currentCell;
                    new_frame[col][row] = 0;
                }
                else{
                    if(bottom_left_empty){
                        new_frame[col-1][row] = currentCell;
                        new_frame[col][row] = 0;
                        continue;
                    }
                    if(bottom_right_empty){
                        new_frame[col+1][row] = currentCell;
                        new_frame[col][row] = 0;
                        continue;
                    }
                }
            }
        }
    }

    // update cells array with the new "frame"
    cells = new_frame;

    console.log(cell_amount);

    stats.end();

    requestAnimationFrame(draw);
}

// start generating particles
canvas.addEventListener("mousedown", ()=>{
    particle_interval_id = setInterval(addParticle, particle_interval);
});

// stop generating particles
window.addEventListener("mouseup", ()=>{
    clearInterval(particle_interval_id);
});

// listen for mousemove to update mouse position
canvas.addEventListener("mousemove", updateMouse);

// adding particle to array, they are looped in the main draw function
function addParticle(){
    for(let i = 0 - (particle_amount/2); i < particle_amount / 2; i++){
        for(let j = 0 - (particle_amount/2); j < particle_amount / 2; j++){
            if(cells[mouse.x + i] && cells[mouse.x + i][mouse.y + j] === 0){
                cells[mouse.x + i][mouse.y + j] = new Particle(particle_type);
                // cells[mouse.x + i][mouse.y + j] = `hsl(${color_hsl},100%,50%)`;
            }
        }
        // color_hsl += hsl_increment;
    }
}

// update mouse position
function updateMouse(e){
    const {x, y} = canvas.getBoundingClientRect();
    mouse.x = Math.floor((e.clientX - x) / cell_w);
    mouse.y = Math.floor((e.clientY - y) / cell_h);
}

// create new particle array
function initArray(w, h) {
    const arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}


function prepareNewFrame(arr){
    const new_frame = [];
    for(let i = 0; i < cols; i++) {
        new_frame[i] = [];
        for(let j = 0; j < rows; j++) {
            new_frame[i][j] = arr[i][j];
        }
    }
    return new_frame;
}

// start the magic
requestAnimationFrame(draw);