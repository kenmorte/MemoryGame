## Installation (For running on local machine)
1) Download/pull Git repo
2) `npm install` *NOTE*: You may need to add `sudo` if permissions are needed
3) `npm start`

## Running the App
There are two ways to run the app. Following are two ways:<br>
**Method 1 (Running on local machine)**
1) Follow installation process above, if not already complete.
2) Point browser to `localhost:3000` for URL link.

**Method 2 (Running on Github instance)**
1) Point browser to 

## Rules of the Game
**Main Rules**
- Cards are laid out on a grid (4x4, 6x6, or 8x8, depending on difficulty)
- Click any two cards to flip them over
  - If these two cards match, score increases and cards stay flipped open
  - Otherwise, the carsd flip back down
- Game ends once all cards have been matched, or timer ends to 0

**Other Rules**
- High score is only recorded when game finishes by having all cards flipped, and *not* when the timer runs out
- Score from Single-player differs from Two-player
  - Single player scores are incremented based on time bonuses, try bonuses, and number of tiles still flipped down
  - Two-player scores are recorded when one player matches two cards, and their point total increases by one. There are no bonuses.
- Difficulty is defined by the following:
  - Easy (4x4 board)
  - Medium (6x6 board)
  - Hard (8x8 board)
- Difficulty and time limits can be adjusted in the Settings screnpvim R
