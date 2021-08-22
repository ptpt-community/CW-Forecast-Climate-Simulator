
varying vec4 vPosition;
varying float vSnoise;

float getTemperature(vec3 position){
    //Temperature = sin(x) ranging from -10 to + 35 which is  -22.5 to + 22.5  and offsetted +12.5
    float temperature =  sin(distance(vec2(0,0),position.xz/20.0));
    temperature -= position.y*.05; /**IMPORTANT!!Need Research*/
    return temperature*22.5 + 12.5 + vSnoise*3.0;
}




void main(){

    vec3 highColor = vec3(1.0,0.5,0.3);
    vec3 lowColor = vec3(0.3, 0.3, .5);



    float temperature = getTemperature(vPosition.xyz);

    float mixStrength = temperature*.025;

    vec3 color = mix(lowColor,highColor,mixStrength);


    gl_FragColor = vec4(color,.8);
}