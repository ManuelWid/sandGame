export class Particle {
    type;
    color;
    // falling = -1;
    // color_sand = ["#f6d7b0", "#f2d2a9", "#eccca2", "#e7c496", "#e1bf92"];
    // color_water = ["#0f5e9c", "#2389da", "#1ca3ec", "#5abcd8", "#74ccf4"];
    // color_hsl = 0; // degree 0-360
    // hsl_increment = 0.5;

    constructor(color = "#fff", type = "sand"){
        this.color = color;
        this.type = type;
        // switch(type){
        //     case "sand":
        //         this.color = this.#randomColor(this.#color_sand);
        //         break;

        //     case "water":
        //         this.color = this.#randomColor(this.#color_water);
        //         break;

        //     default:
        //         this.color = this.#randomColor(this.#color_sand);
        //         break;
        // }
    }

    // randomColor(arr){
    //     return arr[Math.floor(Math.random() * arr.length)];
    // }
}