

// uniform float uSmallWavesElevation;
// uniform float uSmallWavesFrequency;
// uniform float uSmallWavesSpeed;
// uniform float uSmallWavesIterations;


varying float vPosition;




void main(){
    vec4 modelPosition = modelMatrix*vec4(position,1.0);
    //modelPosition.y+= (sin(modelPosition.x*1.2)+ sin(modelPosition.z*1.2))*3.0;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix* viewPosition;

    gl_Position = projectedPosition;

    vPosition = modelPosition.y;
}