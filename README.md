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

<br/>

> [!WARNING]
> This branch is no longer maintained, and will no longer be updated. The project continues on the [Rework](https://github.com/Asgarrrr/Rogue-II/tree/Rework). This branch is a complete overhaul of the project, with a new architecture etc.
> When the Rework branch will be finished, I will merge it with the main branch, and this branch will be deleted.


<br/>

Everytime you play, the dungeon is different. The layout of the dungeon is randomly generated, and the monsters and items
are also randomly generated. The game is a mix between a dungeon crawler and a roguelike. The game is inspired by
[Rogue](https://en.wikipedia.org/wiki/Rogue_(video_game)) and [Dungeon Crawl Stone Soup](https://crawl.develz.org/).
‚
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
  - [Stats & Leveling](#stats--leveling)
  - [Inventory](#inventory)
  - [Equipment](#equipment)
  - [Skills & Spells](#skills--spells)
  - [Saving](#saving)
- [Cheats](#cheats)
- [Roadmap](#roadmap)

## Installation
You can [directly play the game](https://rogue-ii-production.up.railway.app/) on the web. Alternatively, you can clone the repository and run the game locally using the following commands:

```bash
git clone https://github.com/Asgarrrr/Rogue-II
cd Rogue-II
npm install
npm start
```

> **Warning**
> You need to create a `.env` file in the root directory of the project, and add the following line:
> These variables are used to connect to the database, and to run the server, but you can see 2 times the same variable, this is because I use [Railway](https://railway.app/) to host the game with 2 different apps. I will fix this in the future. Also, you need to create a [reCAPTCHA](https://www.google.com/recaptcha/about/) account for the .env file, I will remove this in the future.
> 
```dotenv
MONGO_URI=
PORT=
PORT=
VITE_SERVER_URL=
VITE_reCAPTCHA_PUBLIC_KEY=
reCAPTCHA_PRIVATE_KEY=
```

`npm start` will build the project and start a local back and front server on specified ports in the `.env` file.
Alternatively, you can use `npm run server:start` and `npm run client:start` to start the server and client separately.

## Assets
*I used a lot of assets for this game. I will list them here, and give credits to the creators.*

### Sprites
- [2D Pixel Dungeon Asset Pack](https://pixel-poem.itch.io/dungeon-assetpuck)
  -  Thanks to [pixel_poem](https://twitter.com/pixel_poem) for letting me use his assets for free. This pack contains mainly sprites for the dungeon ( Walls, floors, doors, etc... ) and some characters.
-  For some interface elements, I used some sprites from [Moonlighter](https://moonlighterthegame.com/), a game I really like. I don't know who made the sprites, but I will add the credits if I find them. I have reworked the sprites a bit to fit my game.

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

### Stats & Leveling
Players have 4 stats: Strength, Dexterity, Defense and Constitution. These stats are used to calculate the player's
attack, defense, and health. The stats are also used to calculate the damage of the player's attacks.

At the start of the game, the player has 10 points to distribute between the 4 stats. The player can also level up, and
gain 1 point to distribute. At the moment, the player can only level up by killing monsters, but I plan
to add some rewards for completing quests. For the monsters, the stats are based on the level of the dungeon, with a little
randomness, so you can have a monster with a high attack, but low defense, or the opposite. Maybe I will add some "Boss" monsters
with higher stats, I don't know if we can keep the randomness for this kind of monsters.

Also, the player can equip items, and the stats of the items will be added to the player's stats.

The Dexterity stat is used to calculate the chance to critically hit the enemy. The higher the Dexterity, the higher the chance.
For the moment, the critical hit multiplier is 2, but I plan to add some items that will increase the critical hit multiplier.
1pt of Dexterity = 1% chance to critically hit. Idk if this is balanced, but I will see.

Leveling is based on the XP system, and calculated based on this formula:
```javascript
level                   > Math.ceil( ( Math.sqrt( 1 + ( 8 * Experience ) / 100 ) - 1 ) / 2 )
experience to level up  > ( Math.ceil( level ) * ( Math.ceil( level ) + 1 ) ) * 100
```

### Inventory
The inventory is a simple grid-based inventory. The player can drag and drop items, and can also use items by clicking on them.
The inventory is not implemented yet, but I plan to add it in the future, a crafting system, and some other features.

I don't know if I will add a "hotbar" for the player to use items, and a limited number of items in the inventory.

### Equipment
The player can equip / unequip items. The equipment is not implemented yet, but the logic is already there. The stats of the
equipped items will be added to the player's stats, I also plan to add some items with special effects, like a ring that
will increase the vision range of the player, or a armor that will give the player a chance to dodge attacks ?

### Skills & Spells
For the moment, the player has no skills, and I don't know if I will add skills in the future. I don't know how to implement
this kind of system, before this, I probably need to refactor the code. The notion of "Range" is not implemented yet...

### Saving
EVERYTHING is saved in the database. We use websockets [socket.io](https://socket.io/) to communicate with the server, and the server
saves the data in the database. The server is hosted on [Railway](https://railway.app/), and the database is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
Each move, map, entity, etc... is saved in the database.

![MCD](https://cdn.discordapp.com/attachments/883057183128969216/1095582387628417104/s2.png)

## Cheats

> *Haaaa, my dear friend, you are a cheater. I see you are trying to cheat. I will not let you do that. You can't ..... wait, what? STOP DOING THAT ;(*

I will add a leaderboard, so you can compete with your friends. If you want to cheat, well, you can. But you will not be able to save your progress... you will not be able to play on multiple devices. Your name will be displayed as "Cheater". You will not be able to see the leaderboard. This make me really sad. I hope you will not cheat.

## Roadmap
- [ ] Code refactoring
- [ ] Watch if I can speed up the game with Pixi.js
- [ ] Implement a "level up" system, with a level up screen, animations, etc...
- [ ] Add a "quest" system
- [ ] Add a "crafting" system
- [ ] Add a "skills" system
- [ ] Add a "spells" system
- [ ] Add a skill tree system (maybe)
- [ ] Add items
- [ ] Create inventory system
- [ ] Implement a range system
- [ ] Shop system
- [ ] Mobile compatibility
- [ ] Create a better UI
- [ ] Add a tutorial
- [ ] Leaderboard
- [ ] Add events system

Pfff, I have a lot of work to do...

Thanks for reading, and have fun playing the game !, I hope you will enjoy it.
If you want to help me, you can [buy me a coffee](https://www.buymeacoffee.com/Asgarrrr), or simply add a star on the repository.

*If you read this, you are awesome ! I love you <3*

PS: Why not try the Konami code ? (up, up, down, down, left, right, left, right, b, a)
