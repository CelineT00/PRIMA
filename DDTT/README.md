# DDTT - Die Drei Trottel Tiere

## Inhalt
[Information](#information)

[Concept](#concept)

[Links](#links)

[Criteria](#criteria)

## Informationen
* Title: DDTT
* Author: Celine Tolksdorf 
* Semester: 5., SoSe23
* Curriculum: Prototyping Interaktiver Medien-Apps und Games
* Docent: Prof. Jirka Dell´Oro-Friedl

## Concept 
The Game is a little Jumping game, where you can collect points, when you get items, that are laying on the ground.


## Links
* [Link to Repository:](https://github.com/CelineT00/PRIMA/tree/main/DDTT)
* [Link to Game:](https://celinet00.github.io/PRIMA/DDTT/)
* [Link to Design Document:](https://github.com/CelineT00/PRIMA/blob/main/DDTT/DDTT.pdf)

## Criteria

| Nr | Criterion           | Explanation                                                                                                                                     |
|---:|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions | The character is 1 unit tall and 1 unit wide. The coordinate system starts from the lower left of the character. The rest of the nodes oriantate themselfs by this position.                                                             |
|  2 | Hierarchy           | The nodes all hang onto a graph called Game, which also holds the ComponentCamera. <br><b>Game:</b><ul><li>Character</li><li>Terrain</li><li>Background</li><li>Nature</li><li>Sounds</li><li>Collectibles</li><li>Gegner</li><li>Collectibles2</li></ul>                                                               |
|  3 | Editor              | The Editor was used to build the world and to set the opponents.                                                           |
|  4 | Scriptcomponents    | I used CustomComponentScript for the different Opponents. If I wanted to make more opponents of 1 type i could to that easier with those.                                                          |
|  5 | Extend              | I used one extendet class for the character itself. If i wanted to make another usable chracter, I could use that to build it faster.                       |
|  6 | Sound               | There is a background sond and a sound for Jumping and eating the collectibles.                                            |
|  7 | VUI                 | In the VUI you can see the hearts and the points, that you have.                                          |
|  8 | Event-System        | The Event System was used to detect the colission between the player and the pink Opponent. |
|  9 | External Data       | The config.json sets the hearts and the points of the player.                       |
|  A | Light               | There is an Ambient Light and all the Textures have a ShaderLitTexture.                                                                       |
|  B | Physics             | With the RigidBody the collision of the opponent and the player is detected. The  pink Opponent is moved with Physics.                                       |
|  C | Net                 | Not used.                                                                                                  |
|  D | State Machines      | The black Opponent has 2 states. 1 is Idle and if the Player is near it, it goes into its Attack state.                                  |
|  E | Animation           | I used Spritesheets for the Player and the opponents.                                                |
    
