varying vec4 vPosition;
varying float vSnoise;
varying float temperature;
varying float precipitation;
flat out int index;

uniform float uTemperatureOffset;


/*Global Private*/
vec4 modelPosition;

/**/


vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float simplex(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}


float snoise(float x,float y){
    float seed = 10000.0;
    vec2 v ;
    v.x = x;
    v.y = y;
    vSnoise = simplex(v+seed);
    return vSnoise;
}




float height(vec2 pos){


    float persistance = .707;
    float lacuranity = 2.0;
    float exponentiation = 7.0;
    float height = 50.0;//-->300


    float amplitude = 1.0;
    float frequency = 0.005;
    float normalization = 0.0;
    float total = 0.0;
    float G = pow(2.0, (-persistance));
    float noise = 0.0;

    int octaves = 16;
    int o = 0;



    for (o = 0; o < octaves; o++) {
        noise = snoise(pos.x * frequency, pos.y * frequency);
        noise = noise * .5 + .5;
        total += noise * amplitude;
        normalization += amplitude;
        amplitude *= G;
        frequency *= lacuranity;
    }
    total /= normalization;

    total = pow(total, exponentiation) * height;
    total += snoise(pos.x/ 1000.0, pos.y/1000.0) * 10.0;


    return total;
}


/**

*/
float cold_desert_slope = 1.3636;
float woodland_slope = 5.4545;
float seasonal_forest = 10.00;
float temparature_rain_forest = 14.5454;
float subtropical_desert = 4.6153;
float tropical_seasonal_forest = 5.00;
float tropical_rain_forest = 7.69;


int check_secondPhase(float temperature, float precipitation){
    float a=precipitation/22.00;
    if (a<=cold_desert_slope)return 3;
    else if (a>cold_desert_slope&&a<=woodland_slope)return 4;
    else if (a>woodland_slope&&a<=seasonal_forest)return 5;
    else if (a>seasonal_forest&&a<=temparature_rain_forest)return 6;
    return 1;
}
int check_thirdPhase(float temperature, float precipitation){
    float a=precipitation-temperature*(60.00/13.00);
    if (a<61.538)return 7;
    else if (a>=61.538&&a<118.461)return 8;
    return 9;
}
int getBiome(float temperature, float precipitation){

    if (temperature< -2.00)return 1;
    else if (temperature> -2.00&&temperature<=7.00)return 2;
    else if (temperature>7.00&&temperature<18.00)return check_secondPhase(temperature, precipitation);
    else if (temperature>=18.00&&temperature<33.00) return check_thirdPhase(temperature, precipitation);
    return 8;

}




float getTemperature(float offset){
    //Temperature = sin(x) ranging from -10 to + 35 which is  -22.5 to + 22.5  and offsetted +12.5
    float temperature =  sin(distance(vec2(0, 0), modelPosition.xz/50.0));
    temperature -= modelPosition.y*.1; /**IMPORTANT!!Need Research*/
    return temperature*22.5 + 12.5 + offset;
}



float getPreceipitationMath(float temp){
    float f = 1.25*temp - 30.0;
    float precipitation = 10.0*f -pow(10.0, 0.2*f) + 400.0;
    return precipitation<0.0? 0.0: precipitation;
}



float getPrecipitation(float temperature){
    float  a = getPreceipitationMath(temperature);
    return simplex(modelPosition.xz/1000.0)*a;
}


float getGlaciarLayer(float temperature){
    float temperatureFactor = (temperature)*.05*(-1.0);
    return temperature>0.0? 0.0 : temperatureFactor;

}

/*
*/




void main(){

    modelPosition = modelMatrix*vec4(position, 1.0);
    modelPosition.y = height(modelPosition.xz);


    temperature = getTemperature(uTemperatureOffset);
    precipitation = getPrecipitation(temperature);
    index= ( getBiome(temperature,precipitation) );

    modelPosition.y += getGlaciarLayer(temperature);


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix* viewPosition;
    gl_Position = projectedPosition;


}