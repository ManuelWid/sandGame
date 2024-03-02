import { Particle } from "./class/Particle.js";
import { random, drawGrid } from "./utils/utils.js";

// FPS display
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// options
const cw = 500;
const ch = 500;
const cols = cw / 2;
const rows = cols;
const cell_w = cw/cols;
const cell_h = ch/rows;

let cells = initArray(cols, rows);
let particle_interval_id;
const particle_interval = 100;
const particle_amount = 4; // amout of particles generated on click, squared e.g. 5 means a 5x5 area
let particle_type = "sand";
let cells_on_screen = 0;

const color_sand = ["#f6d7b0", "#f2d2a9", "#eccca2", "#e7c496", "#e1bf92"];
const color_water = ["#0f5e9c", "#2389da", "#1ca3ec", "#5abcd8", "#74ccf4"];

// holds mouse coordinates in cells of the canvas/array, x:0, y:0 would be top left cell
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

    // cells_on_screen = 0;
    
    // loop cell array and draw them to canvas (bottom to top)
    for(let col = cols-1; col >= 0; col--){
        const rowArr = [];
        for(let row = 0; row < rows; row++){
            let roww = ranNum(rowArr);
            const currentCell = cells[roww][col];

            if(currentCell === 0){
                continue;
            }
            // cells_on_screen++;

            // collision
            if(cells[roww][col+1] === 0){
                cells[roww][col+1] = currentCell;
                cells[roww][col] = 0;
                ctx.clearRect(roww * cell_w, col * cell_h, cell_w, cell_h)
                ctx.fillStyle = currentCell.color;
                ctx.fillRect(roww * cell_w, (col+1) * cell_h, cell_w, cell_h);
                continue;
            }
            else{
                const bottom_left_empty = cells[roww-1] && cells[roww-1][col+1] === 0;
                const bottom_right_empty = cells[roww+1] && cells[roww+1][col+1] === 0;
                const both_empty = bottom_left_empty && bottom_right_empty;
                
                if(both_empty){
                    const sign = Math.random() < 0.5 ? -1 : 1;
                    cells[roww+sign][col+1] = currentCell;
                    cells[roww][col] = 0;
                    ctx.clearRect(roww * cell_w, col * cell_h, cell_w, cell_h)
                    ctx.fillStyle = currentCell.color;
                    ctx.fillRect((roww+sign) * cell_w, (col+1) * cell_h, cell_w, cell_h);
                    continue;
                }
                else{
                    if(bottom_left_empty){
                        cells[roww-1][col+1] = currentCell;
                        cells[roww][col] = 0;
                        ctx.clearRect(roww * cell_w, col * cell_h, cell_w, cell_h)
                        ctx.fillStyle = currentCell.color;
                        ctx.fillRect((roww-1) * cell_w, (col+1) * cell_h, cell_w, cell_h);
                        continue;
                    }
                    if(bottom_right_empty){
                        cells[roww+1][col+1] = currentCell;
                        cells[roww][col] = 0;
                        ctx.clearRect(roww * cell_w, col * cell_h, cell_w, cell_h)
                        ctx.fillStyle = currentCell.color;
                        ctx.fillRect((roww+1) * cell_w, (col+1) * cell_h, cell_w, cell_h);
                        continue;
                    }
                }
            }
        }
        // break;
    }
    // console.log(cells_on_screen);

    stats.end();

    // setTimeout(()=>{requestAnimationFrame(draw)}, 1000);
    requestAnimationFrame(draw);
}

function ranNum(arr){
    let r = Math.floor(Math.random() * rows);
    if(arr.includes(r)) return ranNum(arr);
    arr.push(r);
    return r;
};

// start generating particles
canvas.addEventListener("mousedown", ()=>{
    particle_interval_id = setInterval(()=>{
        addParticle(new Particle(random(color_sand)))
    }, particle_interval);
});

// stop generating particles
window.addEventListener("mouseup", ()=>{
    clearInterval(particle_interval_id);
});

// listen for mousemove to update mouse position
canvas.addEventListener("mousemove", updateMouse);

// adding particle to array, they are looped in the main draw function
function addParticle(particle){
    for(let i = -particle_amount; i <= particle_amount; i++){
        for(let j = -particle_amount; j <= particle_amount; j++){
            if(Math.random() < 0.5) continue;
            if(cells[mouse.x + i] && cells[mouse.x + i][mouse.y + j] === 0){
                cells[mouse.x + i][mouse.y + j] = particle;
            }
        }
    }
}

// update mouse position
function updateMouse(e){
    const {x, y} = canvas.getBoundingClientRect();
    mouse.x = Math.floor((e.clientX - x) / cell_w);
    mouse.y = Math.floor((e.clientY - y) / cell_h);
}

// create new particle array
function initArray(w, h, val = 0) {
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