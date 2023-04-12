> **Warning**
> This documentation is on progress, and is not finished yet. I will add more information later.

<h1>
    Rogue II
    <img
        style="width: 40px; vertical-align: text-top; margin: -5px 0 0 0;"
        src="https://cdn.discordapp.com/attachments/853554346150461450/1087978589921759262/rogueChamp.gif"
        alt="d[ o_0 ]b"
        align="right"
    >
</h1>

<a href="https://app.codacy.com/gh/Asgarrrr/Rogue-II/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade"><img src="https://app.codacy.com/project/badge/Grade/c8b1107cb8724871aaea640373772b1a"/></a>
 
Rogue II is a roguelike-style game in which the player explores a dungeon infested with monsters that must be fought in
order to gain experience and rewards. The dungeon is procedurally generated, meaning that each playthrough is different.
Player death is permanent and inevitable. The goal of the game is to survive for as long as possible, using the treasures
found and experience accumulated to improve the player's character.

Everytime you play, the dungeon is different. The layout of the dungeon is randomly generated, and the monsters and items
are also randomly generated. The game is a mix between a dungeon crawler and a roguelike. The game is inspired by 
[Rogue](https://en.wikipedia.org/wiki/Rogue_(video_game)) and [Dungeon Crawl Stone Soup](https://crawl.develz.org/).

Your progress is real-time saved in a database, so you can continue your game later. You can also play the game on multiple
devices, and your progress will be synced between them.

This game is made with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), [MongoDB](https://www.mongodb.com/)
and [Rot.js](https://ondras.github.io/rot.js/hp/). It is an evolution of my first game, [Rogue](https://github.com/Asgarrrr/Rogue).

> **Note**
> Keep in mind that this is a work in progress, and remains a school project. The game is not finished yet, and is still
> in development, so expect bugs and unfinished features. Also, the game is not optimized for mobile devices. If you find
> any bugs, please report them in the [issues](https://github.com/Asgarrrr/Rogue-II/issues/new) section.

<img src="https://cdn.discordapp.com/attachments/883057183128969216/1095376454440722472/localhost_5173_rogue-min.png" alt="game preview" width="100%">

> Yep, currently the game is only a 2D dungeon crawler with a few enemies and items.

## Table of Contents
- [Installation](#installation)
- [Assets](#assets)
  - [Sprites](#sprites)
- [Features](#features)
  - [Dungeon](#dungeon)
  - [Monsters](#monsters)
    - [AI](#ai)
    - [Items](#items)

## Installation

You can [directly play the game](https://rogue-ii-production.up.railway.app/) on the web. Alternatively, you can clone the repository and run the game locally.

```bash
git clone https://github.com/Asgarrrr/Rogue-II
cd Rogue-II
npm install
npm start
```
> **Warning**
> You need to create a `.env` file in the root directory of the project, and add the following line:
> These variables are used to connect to the database, and to run the server, but you can see 2 times the same variable, this is because I use [Railway](https://railway.app/) to host the game with 2 different apps. I will fix this in the future. Also, you need to create a [reCAPTCHA](https://www.google.com/recaptcha/about/) account for the .env file, I will remove this in the future.

```dotenv
MONGO_URI=
PORT=
PORT=
VITE_SERVER_URL=
VITE_reCAPTCHA_PUBLIC_KEY=
reCAPTCHA_PRIVATE_KEY=
```

## Assets
I used a lot of assets for this game. I will list them here, and give credits to the creators.

### Sprites
- [2D Pixel Dungeon Asset Pack](https://pixel-poem.itch.io/dungeon-assetpuck)
  - Thanks to [pixel_poem](https://twitter.com/pixel_poem) for letting me use his assets for free. This pack contains mainly sprites for the dungeon ( Walls, floors, doors, etc... ) and some characters.


- For some interface elements, I used some sprites from [Moonlighter](https://moonlighterthegame.com/), a game I really like. I don't know who made the sprites, but I will add the credits if I find them. I have reworked the sprites a bit to fit my game.

## Features
### Dungeon
Dungeon generation is based on the [Tyrant algorithm](https://www.roguebasin.com/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels).
The algorithm is based on cellular automata, and uses a 2D array of cells to generate the dungeon.
Cells are either walls or floors, and the algorithm uses a set of rules to determine the state of a cell in the next generation.
The algorithm is deterministic, meaning that the same seed will always generate the same dungeon.

### Monsters
Monsters "type" are randomly generated for the moment, per type, I mean that the monster will have a random name, a random sprite,
but will have the same stats. Stats are generated based on the level of the dungeon. The higher the level, the higher the stats.
But the stats are also randomly generated, so you can have a monster with a high attack, but low defense, or the opposite.

#### AI
Monsters have a simple AI. They will move towards the player if they are in the same room, and will attack the player if 
they are in range. If the player is not in the same room, the monster will randomly move around the dungeon.

I plan to add a more complex AI in the future, where monsters will be able to use items, and will be able to use spells.
Also, I plan to add some mechanics to make the game more interesting, like monsters being able to group up, or monsters
being able to use traps.

Ideas: 
- Monsters could have a "group" attribute, and if they are in the same group, they will move together.
- "Steal": If the player opens a chest, but doesn't take the content, a monster could steal the content.

### Items
For the moment, items are not implemented. I plan to add items in the future, but I don't know what kind of items I will add.
Probably some potions, weapons, armor, and maybe some scrolls. I need to think about it, learn how to implement range systems,
and implement the inventory system.
