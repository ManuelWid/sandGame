import { Particle } from "./class/Particle.js";
import { random } from "./utils/utils.js";

// FPS display
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// options
const cw = 500;
const ch = 500;
let cols = 125;
const rows = cols;
const cell_w = cw/cols;
const cell_h = ch/rows;

let cells = initArray(cols, rows, 0);
let particleIntervalId;
const particleInterval = 100;
const particleAmount = 8 // amout of particles generated on click, squared e.g. 5 means a 5x5 area

let color = "#fff";
const color_sand = ["#f6d7b0", "#f2d2a9", "#eccca2", "#e7c496", "#e1bf92"];
const color_water = ["#0f5e9c", "#2389da", "#1ca3ec", "#5abcd8", "#74ccf4"];
let color_hsl = 0; // degree 0-360
const hsl_increment = 0.5;

const mouse = {
    x: 0,
    y: 0
}

const canvas = document.getElementById("canvas");
canvas.width = cw;
canvas.height = ch;
const ctx = canvas.getContext("2d");

function draw(){
    stats.begin();

    // copy current array
    const new_frame = structuredClone(cells);

    // clear canvas
    ctx.reset();
    
    // draw grid, debug only
    // for(let i = 0; i < cw; i += cell_w){
    //     for(let j = 0; j < ch; j += cell_h){
    //         ctx.strokeRect(i, j, cell_w, cell_h);
    //     }
    // }

    // loop cell array from bottom up and draw them to canvas
    for(let col = 0; col < cols; col++){
        for(let row = 0; row < rows; row++){
            if(cells[col][row] === 0) continue;
            ctx.fillStyle = cells[col][row];
            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);

            // gravity
            if(cells[col][row+1] === 0){
                new_frame[col][row+1] = cells[col][row];
                new_frame[col][row] = 0;
            }
            else{
                if((cells[col+1] && cells[col+1][row+1] === 0) &&
                (cells[col-1] && cells[col-1][row+1] === 0)){
                    if(Math.random() > 0.5){
                        if(cells[col+1] && cells[col+1][row+1] === 0){
                            new_frame[col+1][row] = cells[col][row];
                            new_frame[col][row] = 0;
                        }
                    }
                    else{
                        if(cells[col-1] && cells[col-1][row+1] === 0){
                            new_frame[col-1][row] = cells[col][row];
                            new_frame[col][row] = 0;
                        }
                    }
                }
                else{
                    if(cells[col+1] && cells[col+1][row+1] === 0){
                        new_frame[col+1][row] = cells[col][row];
                        new_frame[col][row] = 0;
                    }
                    if(cells[col-1] && cells[col-1][row+1] === 0){
                        new_frame[col-1][row] = cells[col][row];
                        new_frame[col][row] = 0;
                    }
                }
            }
        }
    }
    // update cells array with the new "frame"
    cells = new_frame;

    stats.end();

    requestAnimationFrame(draw);
}

// start generating particles
canvas.addEventListener("mousedown", ()=>{
    particleIntervalId = setInterval(addParticle, particleInterval);
});

// stop generating particles
window.addEventListener("mouseup", ()=>{
    clearInterval(particleIntervalId);
});

// listen for mousemove to update mouse position
canvas.addEventListener("mousemove", updateMouse);

// adding particle to array, they are looped in the main draw function
function addParticle(){
    for(let i = 0 - (particleAmount/2); i < particleAmount / 2; i++){
        for(let j = 0 - (particleAmount/2); j < particleAmount / 2; j++){
            if(cells[mouse.x + i] && cells[mouse.x + i][mouse.y + j] === 0){
                cells[mouse.x + i][mouse.y + j] = random(color_sand);
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
function initArray(w, h, val) {
    const arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

// start the magic
requestAnimationFrame(draw);
