/**
 * MemoryGame
 * Main logic class used to maintain overall game state, score, and board.
 */
class MemoryGame {
    constructor(boardLength, timeLimit, isTwoPlayer) {
        this.isTwoPlayer = isTwoPlayer;
        this.boardLength = boardLength;
        this.timeLimit = timeLimit;

        this.board = [];
        this.players = [];
        this.isOpen = [];
        this.scores = {};

        this.pairsRemaining = 0;
        this.currentPlayerTurn = 0;
        this.currentOpenedCard = null;
        this.currentTries = 0;
        this.currentTryStartTime = null;
        this.previousOpenedCard = null;

        this.resetGame();
    }

    /**
     * Resets the current game state by:
     *  -   Randomizing board cells with new values in new places
     *  -   Resetting scores for players
     *  -   Resetting number of cards to match
     *  -   Resetting flipped cards
     *  -   Player 1 goes first
     */
    resetGame() {
        // Reset board to empty (we'll fill rows/columns out later)
        this.board = [];

        // Initialize number of players/scores to default
        this.players = this.isTwoPlayer ? ['Player 1', 'Player 2'] : ['Player 1'];
        this.scores = this.isTwoPlayer ? {'Player 1': 0, 'Player 2': 0} : {'Player 1': 0};

        // Number of cards still needed to be found
        this.pairsRemaining = (this.boardLength * this.boardLength) / 2;

        // isOpen = List of List of booleans stating if board[i][j] should be left open (meaning the number it holds has been found)
        this.isOpen = [];
        for (let i = 0; i < this.boardLength; i++) {
            let row = [];
            for (let j = 0; j < this.boardLength; j++) {
                row.push(false);
            }
            this.isOpen.push(row);
        }

        // Represents the current status of turn, including metrics used to keep track of score
        this.currentPlayerTurn = 0;
        this.currentOpenedCard = null;
        this.currentTries = 0;
        this.currentTryStartTime = new Date();

        // Used for determining if matching cards are valid
        this.previousOpenedCard = null;

        // Fill board with randomized selection of available double numbers from 1-(n^2)/2
        this.randomizeBoard(this.boardLength);
    }

    /**
     * Flips the given card on the board.
     * Depending on the situation, flipping a card can result in:
     *  -   No-op, eg. if card has already been flipped
     *  -   Flip first card (so it is still current user's turn since they need to flip a second card)
     *  -   Flip second card (if match, then leave the cards open and change turn, otherwise user needs to pick a new card)
     * Returns true if flipped card is a match, false otherwise.
     * @param {Number} i - integer for the row picked on board
     * @param {Number} j - integer for the column picked on board
     */
    flipCard(i, j) {
        // No-op, card not flippable
        if (!this.isCardFlippable(i, j)) return false;
        
        // Indicate the card chosen if flipped
        this.isOpen[i][j] = true;

        // User has flipped their first card, so no match found. However, user has to pick another card again.
        if (!this.currentOpenedCard) {
            this.currentOpenedCard = [i, j];
            this.previousOpenedCard = null;
            this.currentTries = 0;
            return false;
        }

        // Second card flipped, so increment # of tries
        this.currentTries += 2;
        
        const i1 = this.currentOpenedCard[0];
        const j1 = this.currentOpenedCard[1];

        this.previousOpenedCard = [i1, j1];
        this.currentOpenedCard = [i, j];

        // Match = decrement number of cards to match, update user score
        const isMatch = this.board[i][j] === this.board[i1][j1];
        if (isMatch) {
            this.pairsRemaining--;

            const currentPlayer = this.players[this.currentPlayerTurn];
            this.scores[currentPlayer] += this.calculateScore();
        }

        return isMatch;
    }

    /**
     * Resets 2 flipped cards from user turn back down so they aren't visible.
     * Only succeeds in the situation where a user picks a second card that doesn't match with
     * the first card they picked, which means they need to pick another card.
     */
    resetFlippedCards() {
        if (!this.currentOpenedCard || !this.previousOpenedCard) return;

        let i, j;

        i = this.currentOpenedCard[0];
        j = this.currentOpenedCard[1];

        this.isOpen[i][j] = false;

        i = this.previousOpenedCard[0];
        j = this.previousOpenedCard[1];

        this.isOpen[i][j] = false;

        this.currentOpenedCard = null;
        this.previousOpenedCard = null;
    }

    /**
     * Change user turn by resetting the metrics (# of tries, card position, start time) of turn.
     */
    changeTurn() {
        if (++this.currentPlayerTurn === this.players.length) {
            this.currentPlayerTurn = 0;
        }

        this.currentOpenedCard = null;
        this.previousOpenedCard = null;
        this.currentTries = 0;
        this.currentTryStartTime = new Date();
    }

    /**
     * Calculates a given score for the current user's turn.
     * Thanks to https://stackoverflow.com/questions/28086790/calculate-memory-games-score-based-on-the-number-of-attempts-time-spent-and for inspiration in scoring.
     * Scores are based on number of tiles remaining, amount of time to find matched pair, and number of tries needed to match.
     * @param {string} player - player name str (eg. "Player 1", "Player 2")
     */
    calculateScore(player) {
        const tilesRemaining = this.pairsRemaining * 2;
        const timeInSeconds = (new Date().getTime() - this.currentTryStartTime.getTime()) / 1000;
        const numberOfTries = this.currentTries;
        
        const tilesBonus = Math.max(0, (tilesRemaining) * 20); 
        const timeBonus = Math.max(0, (15 - timeInSeconds) * 8);
        const triesBonus = Math.max(((this.boardLength * this.boardLength) - numberOfTries) * 10); 
        const difficultyBonus = 1000 * this.boardLength;

        return Math.round(tilesBonus + timeBonus + triesBonus + difficultyBonus);
    }

    /**
     * Return which player is currently making a move.
     */
    getCurrentPlayerTurn() {
        return this.players[this.currentPlayerTurn];
    }

    /**
     * Return the current score for a given player.
     * @param {string} player - player name str (eg. "Player 1", "Player 2")
     */
    getScore(player) {
        if (!this.scores[player]) return 0;
        return this.scores[player];
    }

    /**
     * Return who would be the current winner in this situation.
     * The format of the result would be an array of length 2 in the format: [PLAYER_NAME, PLAYER_SCORE].
     * A tie would result in returning ["Tie", SCORE].
     */
    getWinner() {
        if (!this.scores) return ['', 0];
        if (this.scores.length === 1) return [this.scores['Player 1'], this.scores['Player 1']];
        if (this.scores['Player 1'] === this.scores['Player 2']) return ['Tie', this.scores['Player 1']];
        if (this.scores['Player 1'] < this.scores['Player 2']) return ['Player 2', this.scores['Player 2']];
        return ['Player 1', this.scores['Player 1']];
    }

    /**
     * Returns true if this is the user's first card flipped
     */
    isFirstFlip() {
        return !this.currentOpenedCard;
    }

    /**
     * Returns true if a given card chosen has already been flipped up.
     * @param {Number} i - integer for the row picked on board
     * @param {Number} j - integer for the column picked on board
     */
    isCardFlipped(i, j) {
        if (i < 0 || i >= this.board.length || j < 0 || j >= this.board.length) return false;
        return this.isOpen[i][j];
    }

    /**
     * Returns true if a given card is available to be flipped (is face down).
     * @param {Number} i - integer for the row picked on board
     * @param {Number} j - integer for the column picked on board
     */
    isCardFlippable(i, j) {
        if (i < 0 || i >= this.board.length || j < 0 || j >= this.board.length) return false;
        return !this.isOpen[i][j];
    }

    /**
     * Returns true if a given card chosen is part of the user's turn.
     * This means it is either the first card chosen, or the second chard chosen to match the first.
     * @param {Number} i - integer for the row picked on board
     * @param {Number} j - integer for the column picked on board
     */
    isCardPartOfTurn(i, j) {
        if (i < 0 || i >= this.board.length || j < 0 || j >= this.board.length) return false;
        if (this.currentOpenedCard && this.currentOpenedCard[0] === i && this.currentOpenedCard[1] === j) return true;
        if (this.previousOpenedCard && this.previousOpenedCard[0] === i && this.previousOpenedCard[1] === j) return true;
        return false;
    }

    /**
     * Returns true if the game is over (a winner/tie is available).
     */
    isGameOver() {
        return this.pairsRemaining === 0;
    }

    /**
     * Helper function to initialize board with random values within the available range placed in random cells in board.
     * @param {Number} boardLength - number of rows/cols in square board
     */
    randomizeBoard(boardLength) {
        let possibleValues = [];
        for (let i = 1; i <= (boardLength*boardLength/2); i++) {
            possibleValues.push(i, i);
        }

        for (let i = 0; i < boardLength; i++) {
            // Row to add in board
            let row = [];

            for (let j = 0; j < boardLength; j++) {
                // Get a random index from our list of possible numbers as cards to choose from
                const index = Math.floor(Math.random() * possibleValues.length);

                row.push(possibleValues[index]);    // Add card value to row
                possibleValues.splice(index, 1);    // Remove random value from array since we can't use it anymore
            }
            this.board.push(row);
        }
    }
}

export default MemoryGame;