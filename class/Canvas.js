export class Canvas {
    canvas_element;
    canvas_width;
    canvas_height;
    cols;
    rows;
    cell_width;
    cell_height;
    cells;
    ctx;

    constructor(canvas_element, canvas_width, canvas_height, cols, rows){
        this.canvas_element = canvas_element;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.cols = cols;
        this.rows = rows;

        this.cell_width = canvas_width / cols;
        this.cell_height = canvas_height / rows;

        canvas_element.width = canvas_width;
        canvas_element.height = canvas_height;

        this.ctx = canvas_element.getContext("2d");

        this.cells = this.initArray(cols, rows);
    }

    initArray(width, height, fill_value = 0) {
        const arr = [];
        for(let i = 0; i < height; i++) {
            arr[i] = [];
            for(let j = 0; j < width; j++) {
                arr[i][j] = fill_value;
            }
        }
        return arr;
    }

    getCell(col, row){
        if(!this.cells[col][row]) return null;
        return this.cells[col][row];
    }
}