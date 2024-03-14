export class Particle {
    type;
    color;
    color_sand = [25,40];
    // color_sand = ["#f6d7b0", "#f2d2a9", "#eccca2", "#e7c496", "#e1bf92"];
    color_water = [215,230];
    // color_water = ["#00296ba0", "#003f88a0", "#00509da0"];
    color_crystal = ["#9b5de5", "#f15bb5", "#f08080"];
    color_grass = ["#80b918", "#55a630", "#aacc00"];
    color_flower = "#ff758f";
    static color_hsl = 0; // degree 0-360
    hsl_increment = 0.1;
    bounces = 0; // for fluids
    transformed = false; // for transforming types e.g. grass
    transform_type;
    state = "solid";
    direction = 0;
    hue;
    saturation;
    lightness;

    constructor(type = "sand"){
        this.type = type;
        switch(type){
            case "sand":
                // this.color = this.randomColor(this.color_sand);
                // this.color = this.randomHSL(this.color_sand[0],this.color_sand[1],70,90,60,70);
                this.color = this.randomHSL(this.color_sand[0],this.color_sand[1],70,90,70,80);
                break;

            case "water":
                // this.color = this.randomColor(this.color_water);
                this.color = this.randomHSL(this.color_water[0],this.color_water[1],90,100,22,25);
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

            case "hsl":
                this.color = `hsl(${Particle.color_hsl},100%,50%)`;
                Particle.color_hsl += this.hsl_increment;
                break;

            case "debug":
                this.color = "red";
                break;

            case "debug-static":
                this.color = "red";
                this.state = "static";
                break;

            default:
                break;
        }
    }

    randomColor(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }

    randomHSL(hmin, hmax, smin=100, smax=100, lmin=50, lmax=50) {
        this.hue = Math.random() * (hmax - hmin) + hmin;
        this.saturation = Math.random() * (smax - smin) + smin;
        this.lightness = Math.random() * (lmax - lmin) + lmin;
        return `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`;
    }

    setHue(hue){
        this.hue = hue;
        this.color = `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`
    }

    setSaturation(sat){
        this.saturation = sat;
        this.color = `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`
    }
    
    setLightness(light){
        this.lightness = light;
        this.color = `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`
    }
}