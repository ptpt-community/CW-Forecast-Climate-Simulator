varying vec4 vPosition;
varying float vSnoise;


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
    float frequency = 0.01;
    float normalization = 0.0;
    float total = 0.0;
    float G = pow(2.0, (-persistance));
    float noise = 0.0;

    int octaves = 5;
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






void main(){

    vec4 modelPosition = modelMatrix*vec4(position, 1.0);
    modelPosition.y = height(modelPosition.xz);


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix* viewPosition;

    gl_Position = projectedPosition;

    vPosition = modelPosition;
}