export class Particle {
    type;
    color;
    color_sand = ["#f6d7b0", "#f2d2a9", "#eccca2", "#e7c496", "#e1bf92"];
    color_water = ["#00296ba0", "#003f88a0", "#00509da0"];
    color_crystal = ["#9b5de5", "#f15bb5", "#f08080"];
    color_grass = ["#80b918", "#55a630", "#aacc00"];
    color_flower = "#ff758f";
    color_hsl = 0; // degree 0-360
    hsl_increment = 0.5;
    bounces = 0; // for fluids
    transformed = false; // for transforming types e.g. grass
    transform_type;
    state = "solid";
    direction = 0;

    constructor(type = "sand"){
        this.type = type;
        switch(type){
            case "sand":
                this.color = this.randomColor(this.color_sand);
                break;

            case "water":
                this.color = this.randomColor(this.color_water);
                this.state = "liquid";
                break;

            case "crystal":
                this.color = this.randomColor(this.color_crystal);
                break;

            case "grass":
                this.color = this.randomColor(this.color_grass);
                break;

            case "static":
                this.color = "#333";
                this.state = "static";
                break;

            case "debug":
                this.color = "red";
                break;

            default:
                break;
        }
    }

    randomColor(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }
}