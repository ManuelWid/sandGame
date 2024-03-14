import { Particle } from "./class/Particle.js";
import { Canvas } from "./class/Canvas.js";
import { circle5, circle10 } from "./utils/shapes.js";
// FPS display
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// options
const cw = 500;
const ch = cw;
const cols = cw / 4;
const rows = cols;
const cell_w = cw/cols;
const cell_h = ch/rows;
const canvas_element = document.getElementById("canvas");
const canvas = new Canvas(canvas_element, cw, ch, cols, rows);

const available_cols = [...Array(rows).keys()];

let particle_interval_id;
let particle_interval = 50;
const particle_interval_default = 50;
const particle_interval_static = 0;
const particle_amount = 5; // amout of particles generated on click, squared e.g. 5 means a 5x5 area
let particle_type = "sand";
let particles_on_screen = 0;
const fluid_bounces = 500; // how often a fluide goes left right before stopping (resets with gravity)
const coversion_rate_sand = 0.8; // sand loss in water, 0-1 higher = more loss

// holds mouse coordinates in cells of the canvas/array, x:0, y:0 would be top left cell
const mouse = {x: 0, y: 0};

const ctx = canvas.ctx;

let cells = canvas.cells;

function draw(){
    stats.begin();

    particles_on_screen = 0;
    
    // loop cell array and draw them to canvas (bottom to top)
    for(let row = rows-1; row >= 0; row--){
        // remaining cols, needed to randomize current col to minimize direction preference
        const current_cols = [...available_cols];
        for(let i = 0; i < cols; i++){
            // using a random column instead of linear 0 to cols.length, minimizes directional preference
            const col = ranNum(current_cols);

            const current_cell = canvas.getCell(col, row);

            if(!current_cell) continue;
            particles_on_screen++;

            const below = cells[col][row+1];

            // gravity
            if(below === 0 && current_cell.state !== "static"){
                cells[col][row+1] = current_cell;
                cells[col][row] = 0;
                current_cell.bounces = 0;
                current_cell.direction = 0;
                ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                ctx.fillStyle = current_cell.color;
                ctx.fillRect(col * cell_w, (row+1) * cell_h, cell_w, cell_h);
                continue;
            }
            // collision
            const bottom_left_empty = cells[col-1] && cells[col-1][row+1] === 0;
            const bottom_right_empty = cells[col+1] && cells[col+1][row+1] === 0;
            const bottom_both_empty = bottom_left_empty && bottom_right_empty;
            switch(current_cell.type){
                // sand
                case "hsl":
                case "sand":
                    // sand/water collision
                    if(below && current_cell.transform_type !== "water" && below.type === "water"){
                        current_cell.transform_type = "water";
                        current_cell.transformed = true;
                        if(Math.random() < coversion_rate_sand){
                            cells[col][row] = 0;
                            ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        }
                        else{
                            cells[col][row] = cells[col][row+1];
                            ctx.fillStyle = cells[col][row].color;
                            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            cells[col][row+1] = current_cell;
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect(col * cell_w, (row+1) * cell_h, cell_w, cell_h);
                        }
                        break;
                    }
                    // physics
                    if(bottom_both_empty){
                        const sign = Math.random() < 0.5 ? -1 : 1;
                        cells[col+sign][row+1] = current_cell;
                        cells[col][row] = 0;
                        ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        ctx.fillStyle = current_cell.color;
                        ctx.fillRect((col+sign) * cell_w, (row+1) * cell_h, cell_w, cell_h);
                        break;
                    }
                    else if(bottom_left_empty){
                        cells[col-1][row+1] = current_cell;
                        cells[col][row] = 0;
                        ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        ctx.fillStyle = current_cell.color;
                        ctx.fillRect((col-1) * cell_w, (row+1) * cell_h, cell_w, cell_h);
                        break;
                    }
                    else if(bottom_right_empty){
                        cells[col+1][row+1] = current_cell;
                        cells[col][row] = 0;
                        ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        ctx.fillStyle = current_cell.color;
                        ctx.fillRect((col+1) * cell_w, (row+1) * cell_h, cell_w, cell_h);
                        break;
                    }
                    // if already in water
                    if(below && current_cell.transform_type === "water"){
                        if(below.type === "water"){
                            cells[col][row] = cells[col][row+1];
                            ctx.fillStyle = cells[col][row].color;
                            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            cells[col][row+1] = current_cell;
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect(col * cell_w, (row+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                        const bottom_left_water = cells[col-1] && typeof cells[col-1][row+1] === "object" && cells[col-1][row+1].type === "water";
                        const bottom_right_water = cells[col+1] && typeof cells[col+1][row+1] === "object" && cells[col+1][row+1].type === "water";
                        const bottom_both_water = bottom_left_water && bottom_right_water;
                        if(bottom_both_water){
                            const sign = Math.random() < 0.5 ? -1 : 1;
                            cells[col][row] = cells[col+sign][row+1];
                            ctx.fillStyle = cells[col][row].color;
                            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            cells[col+sign][row+1] = current_cell;
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((col+sign) * cell_w, (row+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                        else if(bottom_left_water){
                            cells[col][row] = cells[col-1][row+1];
                            ctx.fillStyle = cells[col][row].color;
                            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            cells[col-1][row+1] = current_cell;
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((col-1) * cell_w, (row+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                        else if(bottom_right_water){
                            cells[col][row] = cells[col+1][row+1];
                            ctx.fillStyle = cells[col][row].color;
                            ctx.fillRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            cells[col+1][row+1] = current_cell;
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((col+1) * cell_w, (row+1) * cell_h, cell_w, cell_h);
                            break;
                        }
                    }
                    break;

                // water
                case "water":
                    // convert sand to wet sand/mud
                    if(below && below.type === "sand"){
                        for(let i = 1; i < 5; i++){
                            const below_i = cells[col][row+i];
                            if(below_i && below_i.type === "sand"){
                                below_i.setLightness(60);
                                below_i.transform_type = "water";
                                below_i.transformed = true;
                                ctx.fillStyle = below_i.color;
                                ctx.fillRect(col * cell_w, (row+i) * cell_h, cell_w, cell_h);
                            }
                        }
                    }
                    // physics
                    if(current_cell.bounces > fluid_bounces) break;
                    const left_exist = cells[col-1];
                    const right_exist = cells[col+1];
                    const left_empty = left_exist && cells[col-1][row] === 0;
                    const right_empty = right_exist && cells[col+1][row] === 0;
                    const both_empty = left_empty && right_empty;
                    if((!left_exist || !right_exist)){
                        cells[col][row] = 0;
                        ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        break;
                    }
                    if(both_empty){
                        if(current_cell.direction === 0){
                            const sign = Math.random() < 0.5 ? -1 : 1;
                            current_cell.direction = sign;
                            cells[col+sign][row] = current_cell;
                            cells[col][row] = 0;
                            ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((col+sign) * cell_w, row * cell_h, cell_w, cell_h);
                            current_cell.bounces++;
                            break;
                        }
                        else{
                            cells[col+current_cell.direction][row] = current_cell;
                            cells[col][row] = 0;
                            ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                            ctx.fillStyle = current_cell.color;
                            ctx.fillRect((col+current_cell.direction) * cell_w, row * cell_h, cell_w, cell_h);
                            current_cell.bounces++;
                            break;
                        }
                    }
                    else if(left_empty){
                        current_cell.direction = -1;
                        cells[col-1][row] = current_cell;
                        cells[col][row] = 0;
                        ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        ctx.fillStyle = current_cell.color;
                        ctx.fillRect((col-1) * cell_w, row * cell_h, cell_w, cell_h);
                        current_cell.bounces++;
                        break;
                    }
                    else if(right_empty){
                        current_cell.direction = 1;
                        cells[col+1][row] = current_cell;
                        cells[col][row] = 0;
                        ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                        ctx.fillStyle = current_cell.color;
                        ctx.fillRect((col+1) * cell_w, row * cell_h, cell_w, cell_h);
                        current_cell.bounces++;
                        break;
                    }
                    break;

                // grass
                case "grass":
                    if(below && below.state === "solid" && below.transform_type !== "grass"){
                        for(let i = 1, len = Math.floor(Math.random() * 6); i < len; i++){
                            const below_i = cells[col][row+i];
                            if(below_i){
                                below_i.transform_type = "grass";
                                below_i.transformed = true;
                                if(Math.random() < 0.9){
                                    ctx.fillStyle = current_cell.randomColor(current_cell.color_grass);
                                }
                                else{
                                    ctx.fillStyle = current_cell.color_flower;
                                }
                                ctx.fillRect(col * cell_w, (row+i) * cell_h, cell_w, cell_h);
                            }
                        }
                    }
                    cells[col][row] = 0;
                    ctx.clearRect(col * cell_w, row * cell_h, cell_w, cell_h);
                    break;

                // crystal
                case "crystal":
                    break;

                default:
                    break;
            }
        }
        // break;
    }
    // console.log(particles_on_screen);

    stats.end();

    // setTimeout(()=>{requestAnimationFrame(draw)}, 1000);
    requestAnimationFrame(draw);
}

// start the magic
requestAnimationFrame(draw);

function ranNum(colArr){
    // console.log(colArr);
    const r = Math.floor(Math.random() * colArr.length);
    const res = colArr[r];
    colArr.splice(r, 1);
    return res;
};

function startListen(){
    // start generating particles
    canvas_element.addEventListener("mousedown", ()=>{
        particle_interval_id = setInterval(addParticle, particle_interval);
        // stop generating particles
        window.addEventListener("mouseup", clearInter);
    });
    
    // listen for mousemove to update mouse position
    canvas_element.addEventListener("mousemove", updateMouse);
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

// update mouse position
function updateMouse(e){
    const {x, y} = canvas_element.getBoundingClientRect();
    mouse.x = Math.floor((e.clientX - x) / cell_w);
    mouse.y = Math.floor((e.clientY - y) / cell_h);
}

// create new particle array
function pachinkoArray(w, h, val = 0) {
    const arr = initArray(w, h, val);
    let count = 0;
    const h_obstacles = Math.floor(w/15);
    const v_obstacles = Math.floor(w/20);
    for(let i = 0, len = arr.length; i < len; i++) {
        for(let j = 0; j < len; j++) {
            if(j > w/4 && j < w-(w/3)){
                let hor = i % h_obstacles === 0;
                const vert = j % v_obstacles === 0;
                if(hor && vert){
                    let offset = 0;
                    if(count % 2 === 0){
                        offset = h_obstacles/2;
                    }
                    for(let m = 0; m < circle5.length; m++){
                        for(let n = 0; n < circle5.length; n++){
                            if(circle5[m][n] === 1 && arr[i+m+offset]){
                                    arr[i+m+offset][j+n] = new Particle("static");
                                    ctx.fillStyle = arr[i+m+offset][j+n].color;
                                    ctx.fillRect((i+m+offset) * cell_w, (j+n) * cell_h, cell_w, cell_h);
                            }
                        }
                    }
                    count++;
                }
            }
        }
    }
    return arr;
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
const choices = document.querySelector("#particles");
choices.addEventListener("click", (e)=>{
    if(e.target.classList.contains("btn")){
        for(let btn of choices.children){
            btn.classList.remove("active-bottom");
        }
        e.target.classList.add("active-bottom");
        particle_type = e.target.dataset.type;
        if(particle_type === "static"){
            particle_interval = particle_interval_static;
        }
        else{
            particle_interval = particle_interval_default;
        }
    }
});

// get template choice from html btns
const templates = document.querySelector("#templates");
templates.addEventListener("click", (e)=>{
    if(e.target.classList.contains("btn")){
        for(let btn of templates.children){
            btn.classList.remove("active-top");
        }
        e.target.classList.add("active-top");
        switch(e.target.dataset.template){
            case "empty":
                ctx.reset();
                cells = initArray(cols, rows);
                break;

            case "pachinko":
                ctx.reset();
                cells = pachinkoArray(cols, rows);
                break;

            default:
                break;
        }
    }
});