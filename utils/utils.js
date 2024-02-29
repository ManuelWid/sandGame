export function random(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

export function drawGrid(ctx, cw, ch, cell_w, cell_h){
    for(let i = 0; i < cw; i += cell_w){
        for(let j = 0; j < ch; j += cell_h){
            ctx.strokeRect(i, j, cell_w, cell_h);
        }
    }
}