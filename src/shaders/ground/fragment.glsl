varying vec4 vPosition;
varying float vSnoise;
varying float temperature;
varying float precipitation;
varying float vAngle;

flat in int index;
vec3 biomeColor[10];


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







void main(){
 //check
    biomeColor[1]=vec3(1.0, 1.0, 1.0);// ->Tundra
    biomeColor[2]=vec3(.6, 1.0, .6);//->Cold Desert//Grassland

    biomeColor[3]=vec3(.5, .8, .5);//woodland
    biomeColor[4]=vec3(.6, .8, .6);//->Seasonal Forest

    biomeColor[5]=vec3(.4, .7, .4);//rgb(153, 153, 102)->temperate Rain Forest

    biomeColor[6]=vec3(.1, .7, .1);//rgb(102, 255, 153)->Tropical Rain Forest

    biomeColor[7]=vec3(.7,.9,.5);//rgb(255, 166, 77)->Savannah

    biomeColor[8]=vec3(.9, .9, .4);//rgb(255, 240, 179)-> Subtropical Desert
    biomeColor[9]=vec3(.8, 1.0, .8);//rgb(102, 255, 153)->Boreal Forest



    float blueness = -50.0/(temperature+10.0);
    blueness = blueness < .6? .6 : blueness;

    vec3 stoneColor =  vec3(.6,.6, blueness )  ;

    vec3 highColor = vec3(1.0, 0.5, 0.3);
    vec3 lowColor = vec3(0.3, 0.3, .5);




    float temperatureStrength = temperature*.025;
    float precipitationStrength = precipitation*.0025;

    float mixStrength =precipitationStrength;

    vec3 environmentColor[3];
    int colorSelection = 0;
    environmentColor[0] = vAngle<.525? biomeColor[index]: stoneColor; // Natural
    environmentColor[1] = mix(lowColor,highColor,temperatureStrength); //Temperature
    environmentColor[2] = mix(lowColor,highColor,precipitationStrength); //Precipitation

    //vec3 color = mix(highColor,lowColor,mixStrength);

    vec3 color = environmentColor[colorSelection];


    //   vec3 color = vec3(vAngle,1.0,1.0); //slope
    // vec3 color = vec3((((simplex(vPosition.xy)+1.0))/2.0)*1.0,.0,.0); //SIMPLEX TEST



    gl_FragColor = vec4(color, .8);
}
