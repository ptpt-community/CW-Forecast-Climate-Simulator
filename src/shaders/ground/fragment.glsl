//uniform vec3 uDepthColor;
//uniform vec3 uSurfaceColor;
//uniform float uColorOffset ;
// uniform float uColorMultiplier;

varying float vPosition;

void main(){

    vec3 highColor = vec3(.01,.9,.01);
    vec3 lowColor = vec3(0.7922, 0.9725, 0.451);



    float mixStrength = (vPosition)*.001;
    vec3 color = mix(lowColor,highColor,mixStrength);


    gl_FragColor = vec4(color,.8);
}