
# Task Plan

### Objective:
- World Creation
    - Ground
    - Mountains
    - Ocean
    - Temperature
    - Pressure
    - Glaciar Ice

- Simulate Climate on the world
    - Define current year : 2000
    - Define World Status using the defined year: precipitation, water height, glaciar height temperature
    - Biome
    - UI to offset World Parameters, to change Biome and World status

- Keep things performant
- Serve the Simulation


### World creation:

We know that the mountains, ground, sea appear randomly in the world. But it also seems that it tries to preserve what is right next to it. Therefore we created a function using pseudorandom (hash like) numbers. 

The function takes x, y as coordinate and outputs z as a height. Which we can use to make our terrain.


In depth view of the terrain generator:
We generate the random numbers (noise) for each x and y around the camera. Then we use a kernel of 3x3 to find a filtered value to define the terrain. The filtered value smoothens the randomness. Therefore it looks more terrainlike.


### Ground: 
Note that we are allowed to decide how far we want to reach with our 3x3 kernel. This is our wavelength. The less we reach with the kernel the less random it will be. 

The terrain still looks random. Since the GPU does not know what the inbetween values will be. For that, we use interpolation. The interpolation gives an equation of a smooth curve, which we can use to get a smoother terrain.

### Mountain: 
We have smoother surface, but we still need a way to differentiate mountains, oceans and tectonics in the 3D curve.

To make mountians that we use this logic:
 - The value that tends to go higher make it go higher.
 - The value that tends to keep as it is, make it stay as it is. 

Therefore the higher areas of the current curve will tend to make mountains and plane areas will tend to stay plane.

### Ocean: 
We have mountains and planes now. But ocean mostly left. For the ocean we introduce a tectonic function. It is a simple function noise function with a very big wavelength. We add the z value with the previous value we got from the mountain creation and we get our final terrian height value.

Now some places in the world will be more higher than other places. We can set a threshold to define ocean now. 


### Temperature:
We use a sin wave to define temperature ranges. Therefore we get a temperature range defined in the world like: Low -  High - Low. Threfore if we know coordinate of the world, we know the temperature.

### Precipitation:
The possible-precipitation of the world is defined like tectonics, a mediam wavelength noise function. Then we used whittaker's biome chart to define the highest precipitation and lowest precipitation in a particular temperature. Therefore a place has a "potential precipitation" that increases or decreases when the temperature changes. This method helped us simulate the answer to the questions like: Why are there increase of Rain when world is getting desertified? Since this is based on previously found temperature and already defined coordinates, if we know coordinate of a place, we know its precipitation.


### Glaciar Ice:
If a precipitation is less than 0, because it has way cold temperature (<0), we turned the place icy. Therefore on temperature rise, the ice melts and on temperature decrease, the ice readds.


### Simulate Climates on the World
We define the current status of the world as year 2000. We define the current world status: temperature, precipitation, glaciar ice, water height as situation of the year 2000.


### Biome:
We implement whittaker's function by using the diagram defined in the following [article](https://en.wikipedia.org/wiki/Biome).
![image](https://user-images.githubusercontent.com/55809005/141683303-8b4e07f2-9fe0-4a2c-b76c-ce78478a2557.png)


To implement the function, we put the diagram in a grid. After that we treat each biome as a tetragon. Temperature and Precipitation, being a point, we just have to figure out, whether a point exists inside any tetragon or not. The tetragon the point belongs to, is the biome of that particular point.
Threfore: Since if we know coordinate of the system: we know precipitation and temperature, we can know biome of that coordinate as well.

UI and Offsetting:
- We set an end point for the UI: the temperature offset, and water height offset. 
- User is able to offset the year, temperature. If the system knows the temperature, and since it already has world state defined, it can generate new world state now.
- Now we convert UI data to temperature and Water Height using the following predictions.
  1. Temperature -> Temperature (No modification Necessary)
  2. Year -> Temperature (Source: ), WaterHeight (Source)
  3. CO₂ -> Year (Source), WaterHeight
  4. The parts that do not have source mentioed areSource, WaterHeight derived from other parameters. For example: CO₂ gives Year, year gives water height
- Color the Terrain: We use slope of a certain point in the world to check whether its a rock or default biome color. Based on the data we color the ground. The default biome color is defined prior to the calculation. The GPU selects the color only.
  [LIST ALL THE COLORS against Biome HERE]. 

  Similarly we color the terrain with two color and their inbetween colors, blue and red and inbetween to show high, low temperature and precipitation in Temperature Rendering and Precipitation Rendering.

The proposed planning can be briefly put into this activity model.

![image](https://user-images.githubusercontent.com/55809005/141683211-6e7375db-11bb-4c15-86d6-8c6413b8a354.png)



### Performance
To keep things usable and development friendly, we have used some optimization techniques. Listed below.
- The world is math based and infinite. We have loaded a part of it. For this project we choose the static method, that only shows part of the world. Since world building is not directly related to the project. The dynamically loaded infinite world is available in the source code for our future project where a user can roam freely. It uses camera's position to calculate the chunks to be loaded. 

The resources near to camera gets better resolution and more resources. To implement this we used the data structure named Quad Tree. It simply takes position of the camera and decides whether a chunk should get more resources based on the distance to the camera.

[Quad Tree Image]

To keep the calculation easier for the CPU we moved the showing of the terrain to GPU. Since GPU can do same type of calculation at once which is exactly what we need.



### Serving
We used webpack to compile the whole project into a single javascript file. Then we serve the javascript file to whoever that wants to run the project on their browser.




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






# Implemented User Scenario

### Climate Simulator:
- Users can change the current year.
- Users can change the average temperature.
- Users can change the average carbon dioxide in the year.
- Users can change the render type to the following: natural, temperature based or precipitation based.
- Users can see the 3D representation of the artificial world.
- Users can see the generated sin(worldPositon.x) temperature map.
- Users can see the precipitation map generated based on Ken Perlin’s simplex noise and Whittaker's temperature vs biome model.
- Users can see the changes made by the upper two models if  the climate parameters are changed.
- Users can see the Biome based natural representation on the world. 
- Users can see the changes of biomes on the basis of parameters.
- Users can see the change of glacier ice height.
- Users can see the changes of water height.
- Users can see their own height.
- Users have access to the biome example look bar to know about the biomes.
- Users has access to the color chart to match the biomes
- Stunning view for the users to wonder around

