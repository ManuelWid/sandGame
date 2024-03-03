import { Particle } from "./class/Particle.js";

// FPS display
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// options
const cw = 500;
const ch = 500;
const cols = cw / 5;
const rows = cols;
const cell_w = cw/cols;
const cell_h = ch/rows;

const available_rows = [...Array(rows).keys()];

const cells = initArray(cols, rows);
let particle_interval_id;
const particle_interval = 100;
const particle_amount = 5; // amout of particles generated on click, squared e.g. 5 means a 5x5 area
let particle_type = "sand";
let particles_on_screen = 0;
const fluid_bounces = 500; // how often a fluide goes left right before stopping (resets with gravity)

// holds mouse coordinates in cells of the canvas/array, x:0, y:0 would be top left cell
const mouse = {x: 0, y: 0};

// cutout (void) circle, only works with particle_amount 5
const circle10 = [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0]
];

const circle5 = [
    [0,1,1,1,0],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [0,1,1,1,0],
]

const canvas = document.getElementById("canvas");
canvas.width = cw;
canvas.height = ch;
const ctx = canvas.getContext("2d");

function draw(){
    stats.begin();

    particles_on_screen = 0;
    
    // loop cell array and draw them to canvas (bottom to top)
    for(let col = cols-1; col >= 0; col--){
        // remaining rows, needed to randomize current row to minimize direction preference
        const current_rows = [...available_rows];
        for(let i = 0; i < rows; i++){
            let row = ranNum(current_rows);

            const current_cell = cells[row][col];

            if(current_cell === 0) continue;
            particles_on_screen++;
            const below = cells[row][col+1];

            // gravity
            if(below === 0 && current_cell.state !== "static"){
                cells[row][col+1] = current_cell;
                cells[row][col] = 0;
                current_cell.bounces = 0;
                current_cell.direction = 0;
                ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                ctx.fillStyle = current_cell.color;
                ctx.fillRect(row * cell_w, (col+1) * cell_h, cell_w, cell_h);
                continue;
            }
            // collision
            else{
                const bottom_left_empty = cells[row-1] && cells[row-1][col+1] === 0;
                const bottom_right_empty = cells[row+1] && cells[row+1][col+1] === 0;
                const bottom_both_empty = bottom_left_empty && bottom_right_empty;
                switch(current_cell.type){
                    // sand
                    case "sand":
                        if(bottom_both_empty){
                            const sign = Math.random() < 0.5 ? -1 : 1;
                            cells[row+sign][col+1] = current_cell;
                            cells[row][col] = 0;
                            ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.colors;
                            ctx.fillRect((row+sign) * cell_w, (col+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                        else if(bottom_left_empty){
                            cells[row-1][col+1] = current_cell;
                            cells[row][col] = 0;
                            ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((row-1) * cell_w, (col+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                        else if(bottom_right_empty){
                            cells[row+1][col+1] = current_cell;
                            cells[row][col] = 0;
                            ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((row+1) * cell_w, (col+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                        break;

                    // water
                    case "water":
                        if(current_cell.bounces > fluid_bounces) break;
                        const left_exist = cells[row-1];
                        const right_exist = cells[row+1];
                        const left_empty = left_exist && cells[row-1][col] === 0;
                        const right_empty = right_exist && cells[row+1][col] === 0;
                        const both_empty = left_empty && right_empty;
                        if((!left_exist || !right_exist)){
                            cells[row][col] = 0;
                            ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                            break;
                        }
                        if(both_empty){
                            if(current_cell.direction === 0){
                                const sign = Math.random() < 0.5 ? -1 : 1;
                                current_cell.direction = sign;
                                cells[row+sign][col] = current_cell;
                                cells[row][col] = 0;
                                ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                                ctx.fillStyle = current_cell.color;
                                ctx.fillRect((row+sign) * cell_w, col * cell_h, cell_w, cell_h);
                                current_cell.bounces++;
                                break;
                            }
                            else{
                                cells[row+current_cell.direction][col] = current_cell;
                                cells[row][col] = 0;
                                ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                                ctx.fillStyle = current_cell.color;
                                ctx.fillRect((row+current_cell.direction) * cell_w, col * cell_h, cell_w, cell_h);
                                current_cell.bounces++;
                                break;
                            }
                        }
                        else if(left_empty){
                            current_cell.direction = -1;
                            cells[row-1][col] = current_cell;
                            cells[row][col] = 0;
                            ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((row-1) * cell_w, col * cell_h, cell_w, cell_h);
                            current_cell.bounces++;
                            break;
                        }
                        else if(right_empty){
                            current_cell.direction = 1;
                            cells[row+1][col] = current_cell;
                            cells[row][col] = 0;
                            ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((row+1) * cell_w, col * cell_h, cell_w, cell_h);
                            current_cell.bounces++;
                            break;
                        }
                        break;

                    // grass
                    case "grass":
                        if(below && below.state === "solid" && below.transformed === false){
                            for(let i = 1, len = Math.floor(Math.random() * 6); i < len; i++){
                                const below_i = cells[row][col+i];
                                if(below_i){
                                    below_i.transform_type = "grass";
                                    below_i.transformed = true;
                                    ctx.fillStyle = current_cell.randomColor(current_cell.color_grass);
                                    ctx.fillRect(row * cell_w, (col+i) * cell_h, cell_w, cell_h);
                                }
                            }
                        }
                        cells[row][col] = 0;
                        ctx.clearRect(row * cell_w, col * cell_h, cell_w, cell_h);
                        break;

                    // crystal
                    case "crystal":
                        break;

                    default:
                        break;
                }
            }
        }
        // break;
    }
    console.log(particles_on_screen);

    stats.end();

    // setTimeout(()=>{requestAnimationFrame(draw)}, 1000);
    requestAnimationFrame(draw);
}

// start the magic
requestAnimationFrame(draw);

function ranNum(rowArr){
    // console.log(rowArr);
    const r = Math.floor(Math.random() * rowArr.length);
    const res = rowArr[r];
    rowArr.splice(r, 1);
    return res;
};

function startListen(){
    // start generating particles
    canvas.addEventListener("mousedown", ()=>{
        particle_interval_id = setInterval(addParticle, particle_interval);
        // stop generating particles
        window.addEventListener("mouseup", clearInter);
    });
    
    // listen for mousemove to update mouse position
    canvas.addEventListener("mousemove", updateMouse);
}

function clearInter(){
    clearInterval(particle_interval_id);
    window.removeEventListener("mouseup", clearInter);
}

startListen();

// adding particle to array, they are looped in the main draw function
function addParticle(){
    if(particle_type === "static"){
        const len = Math.floor(circle5.length/2);
        for(let i = -len; i <= len; i++){
            const exists_horizontal = cells[mouse.x + i];
            for(let j = -len; j <= len; j++){
                if(exists_horizontal && circle5[len + i][len + j] === 1){
                    cells[mouse.x + i][mouse.y + j] = new Particle(particle_type);
                    ctx.fillStyle = cells[mouse.x + i][mouse.y + j].color;
                    ctx.fillRect((mouse.x + i) * cell_w, (mouse.y + j) * cell_h, cell_w, cell_h);
                }
            }
        }
    }
    else if(particle_type === "void"){
        const len = circle10.length/2;
        for(let i = -len; i < len; i++){
            const exists_horizontal = cells[mouse.x + i];
            for(let j = -len; j < len; j++){
                if(exists_horizontal && circle10[len + i][len + j] === 1){
                    ctx.clearRect((mouse.x + i) * cell_w, (mouse.y + j) * cell_h, cell_w, cell_h);
                    cells[mouse.x + i][mouse.y + j] = 0;
                }
            }
        }
    }
    else{
        for(let i = -particle_amount; i < particle_amount; i++){
            const exists_horizontal = cells[mouse.x + i];
            for(let j = -particle_amount; j < particle_amount; j++){
                if(particle_type === "void" && exists_horizontal){
                    if(circle10[particle_amount + i][particle_amount + j] === 1){
                        ctx.clearRect((mouse.x + i) * cell_w, (mouse.y + j) * cell_h, cell_w, cell_h);
                        cells[mouse.x + i][mouse.y + j] = 0;
                    }
                }
                else{
                    if(Math.random() < 0.5) continue;
                    if(exists_horizontal && cells[mouse.x + i][mouse.y + j] === 0){
                        cells[mouse.x + i][mouse.y + j] = new Particle(particle_type);
                        ctx.fillStyle = cells[mouse.x + i][mouse.y + j].color;
                        ctx.fillRect((mouse.x + i) * cell_w, (mouse.y + j) * cell_h, cell_w, cell_h);
                    }
                }
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

// get particle choice from html btns
const choices = document.querySelector("#choices");
choices.addEventListener("click", (e)=>{
    if(e.target.classList.contains("btn")){
        for(let btn of choices.children){
            btn.classList.remove("active");
        }
        e.target.classList.add("active");
        particle_type = e.target.dataset.type;
    }
})