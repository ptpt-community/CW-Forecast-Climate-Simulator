# Important Modules, Classes and Functions:
## Typescript Part:
Language Type: Object Oriented

Design Method: OOP principles and Design Patterns

Responsibility: Divide Landscape into chunks, provide GPU one chunk at a time to update

#### Important Classes and Types:
Terrain Chunk: A chunk. Keeps the functionality to hide, unhide and destroy the chunk.

Terrain Chunk Manager: Holds all chunks together, decides when to hide, unhide, create or destroy a chunk.

ChunkBuilder: Takes Chunk from Terrain Chunk Manager and gives it to the GPU.

ChunkDirector (Interface): Implemented by QuadTree and GridChunkDirector. Used by TerrainChunkManager to decide which chunk to keep and which to destroy.

QuadTree: Takes a position as input and creates plane coordinates around it based on the distances. The planes are later converted into chunks. This is for better performance. The idea is all planes get same resource. Therefore the bigger sized planes get less relative resource. Since this quad tree is making sure that bigger planes stay far away from the camera.

GridChunkDirector: An alternative to QuadTree to implement infinite terrain (Currently Turned Off). It uses a 3x3 grid of 9 squares where center square has the highest resource. In the center highest resource region, it is divided into another 3x3 grid to distribute the resources again. The camera stays at the center.

Renderer: For each AnimationFrame, call GPU to render all the Renderables. Which shows things on the screen.

Rendarable (Interface): Implemented by WaterScene, TerrainChunkManager to show things on the screen by the Renderer.

WaterScene: Controls Water view and Settings.

SkyScene: Controls Sky View.

CameraSettings: Controls Camera Settings

MovementController: Controls on Keypress moves.


## GLSL Part
Language Type: Structured Programming Language

Design Method: OOP is not possible. Therefore we tried to use `functional Programming` methodology: "Do not change state when a function is run. The memory structure when you enter the function and exit the function have to be same."

Responsibility: Perform calculations on the data received as Chunk to create terrain (Vertex Shader) and show it on the screen (Fragment Shader)

### Vertex Shader:

#### Structs:

Rectangle: Mathemetical Rectangle with 4 coordinates. Used to define bounds of biomes on Whittaker's Diagram.

Triangle: Mathemetical Triangle using 3 coordinates. 

#### Functions:

snoise (x, y): Generates noise and smoothens the noise using Simplex Noise kernel.

height (x, y): takes, x,y : the location on a terrain and gives z, the height of the terrain.

getTemperature (x, y, z): Using terrain coordinates, tells temperature of a given position + offset, the offset is input by the user.

maxPrecipitation(temperature) : Tells the maximum possible precipitation of a certain temperature using Whittaker's Diagram.

precipitation (x, y, temperature): Tells precipitation of a point on a terrain.

getBiome(temperature, precipitation): Returns a biome number, by calculating in which rectangular biome a point (temperature, precipitation) belong to.

slope (x, y) : Calculates slope on a position of a terrain coordinate.

main: Draws the terrain positions, and sends biome, slope to the fragment shader.

### Fragment Shader:
main: Defines different color for the biomes. Uses slope to show rocks and ice, for easier height visualization and draws on the screen.



## Frontend Part: 

Language: HTML, CSS, Javascript

Language Type: Markdown, Scripting, Object Oriented.

Responsibility: 

* Loading Canvas element on the browser where the Webgl will draw the simulation.
* Drawing User Interface
* Taking user input
* Calculating year to temperature offset and water offset, carbon di oxide to temperature offset and water offset values from user input.
* Providing the Water and Temperature values to the Simulator.

