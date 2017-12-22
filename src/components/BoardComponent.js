import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { black, blue500, white, green500 } from 'material-ui/styles/colors';

const styles = {
    boardContainer: {
        width: '100%',
        height: '100%',
    },

    cardContainer: {
        margin: 'auto',
        display: 'inline-block',
    },

    card: {
        background: blue500,
        width: '90%',
        height: '90%',
        padding: 10,
        cursor: 'pointer',
    },

    cardValue: {
        color: black,
        width: '100%',
        height: '100%',
        borderRadius: 2.5,
        background: white,
        cursor: 'default',
    },

    cardValueText: {
        fontSize: 22,
        cursor: 'default',
    }
};

/**
 * MemoryCard component
 * Represents single memory card/cell in board for UI.
 * 
 * Size is recalculated based on size of overall board.
 * Flipped status indicates that number is shown for cell.
 * A highlighted number in green indicates that the cell is part of a user's current turn where the match has not been found yet.
 *      Otherwise, a black highlighted number indicate that its pair has already been found.
 */
const MemoryCard = (props) => {
    const { value, isFlipped, isHighlighted, boardLength, onClick, i, j } = props;

    // Inline style object for the size of a single cell in the board
    const sizeStyle = {
        width: ((1.0 / boardLength) * 100) + '%',
        height: ((1.0 / boardLength) * 100) + '%',
    };

    // Calculated inline styles for card based on size/flipped status
    const style = Object.assign({}, styles.cardContainer, sizeStyle);
    const cardStyle = Object.assign({}, styles.card, {cursor: isFlipped ? 'default' : 'pointer'});
    const cardValueStyle = Object.assign({}, styles.cardValue, {visibility: isFlipped ? 'visible' : 'hidden'});

    // Highlight the current cards that are trying to be matched
    if (isHighlighted) cardValueStyle.color = green500;

    return (
        <div style={style} onClick={() => onClick(i,j)}>
            <Paper style={cardStyle} zDepth={2} >
                <div style={cardValueStyle}>
                    <span style={styles.cardValueText}>{value}</span>
                </div>
            </Paper>
        </div>
    );
};

/**
 * BoardComponent
 * Represents an entire board of MemoryCard cell components to play the Memory Game on the UI.
 */
class BoardComponent extends Component {

    /**
     * Returns a list of MemoryCard components representing each cell on the board from the game model.
     * List will be rendered into actual board in render() function.
     */
    renderBoard() {
        const board = this.props.game.board;
        let res = [];

        board.forEach((row, i) => {
            row.forEach((value, j) => {
                res.push(
                    <MemoryCard
                        key={'cell(' + i + ',' + j + ')'}
                        i={i}
                        j={j}
                        value={value}
                        isFlipped={this.props.game.isCardFlipped(i, j)}
                        isHighlighted={this.props.game.isCardPartOfTurn(i, j)}
                        boardLength={board.length}
                        onClick={this.props.onCardClick}
                    />
                );
            })
        });
        return res;
    }

    render() {
        return (
            <div style={styles.boardContainer}>
                {this.renderBoard()}
            </div>
        );
    }
}

export default BoardComponent;