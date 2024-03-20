export class Particle {
    type;
    color;
    color_sand = [25,40];
    color_water = [215,230];
    color_crystal = [250,265];
    color_grass = [80,100];
    color_fire = [0, 10];
    color_flower = "#ff758f";
    static color_hsl = 0; // degree 0-360
    hsl_increment = 0.05;
    bounces = 0; // for fluids
    transformed = false; // for transforming types e.g. grass
    transform_type;
    state = "solid";
    direction = 0;
    duration_max = 20; // for self destructing particles
    duration = 20; // for self destructing particles
    hue;
    saturation;
    lightness;
    alpha = 1;

    constructor(type = "sand"){
        this.type = type;
        switch(type){
            case "sand":
                this.color = this.randomHSL(this.color_sand[0],this.color_sand[1],70,90,70,80);
                break;

            case "water":
                this.color = this.randomHSL(this.color_water[0],this.color_water[1],90,100,22,25);
                this.state = "liquid";
                break;

            case "crystal":
                this.alpha = 0.8;
                this.color = this.randomHSL(this.color_water[0],this.color_water[1],70,90,55,65);
                break;

            case "grass":
                this.color = this.randomHSL(this.color_grass[0],this.color_grass[1],70,80,40,45);
                break;

            case "fire":
                this.color = this.randomHSL(this.color_fire[0],this.color_fire[1],90,100,40,60);
                this.state = "gas";
                break;
                
            case "clone":
            case "remover":
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

    randomHSL(hmin, hmax, smin=100, smax=100, lmin=50, lmax=50) {
        this.hue = Math.floor(Math.random() * (hmax - hmin) + hmin);
        this.saturation = Math.floor(Math.random() * (smax - smin) + smin);
        this.lightness = Math.floor(Math.random() * (lmax - lmin) + lmin);
        return `hsl(${this.hue},${this.saturation}%,${this.lightness}%, ${this.alpha})`;
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
    
    setAlpha(alpha){
        this.alpha = alpha;
        this.color = `hsl(${this.hue},${this.saturation}%,${this.lightness}%, ${alpha})`
    }
}