export class Particle {
    type;
    color;
    #color_sand = ["#f6d7b0", "#f2d2a9", "#eccca2", "#e7c496", "#e1bf92"];
    #color_water = ["#0f5e9c", "#2389da", "#1ca3ec", "#5abcd8", "#74ccf4"];

    constructor(type = "sand"){
        this.type = type;
        switch(type){
            case "sand":
                this.color = this.#randomColor(this.#color_sand);
                break;

            case "water":
                this.color = this.#randomColor(this.#color_water);
                break;

            default:
                this.color = this.#randomColor(this.#color_sand);
                break;
        }
    }

    #randomColor(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }

    getColor(){
        return this.color;
    }

    // set(x = 0, y = 0, color = "#fff"){
    //     this.x = x;
    //     this.y = y;
    //     this.color = color;
    // }

    // get(){
    //     return this;
    // }

    // #format(x, y){
    //     if(x instanceof Particle){
    //         return [x.x, x.y];
    //     }

    //     return [x, y];
    // }


    // getStr(){
    //     return `${this.x},${this.y}`;
    // }

    // add(x = 0, y = 0){
    //     [x, y] = this.#format(x, y);
    //     this.x += x;
    //     this.y += y;
    // }

    // sub(x = 0, y = 0){
    //     [x, y] = this.#format(x, y);
    //     this.x -= x;
    //     this.y -= y;
    // }

    // mlt(x = 0, y = 0){
    //     [x, y] = this.#format(x, y);
    //     this.x *= x;
    //     this.y *= y;
    // }

    // div(x = 0, y = 0){
    //     [x, y] = this.#format(x, y);
    //     this.x /= x;
    //     this.y /= y;
    // }

    // dist(x = 0, y = 0){
    //     [x, y] = this.#format(x, y);
    //     return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    // }
}