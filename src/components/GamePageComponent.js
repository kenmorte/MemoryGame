import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import { black, green300 } from 'material-ui/styles/colors';
import BoardComponent from './BoardComponent';
import MemoryGame from '../MemoryGame';
import { getTimeStr } from '../helpers/helpers';


const styles = {
    content: {
        textAlign: 'center',
        fontFamily: 'Chalkboard',
        color: '#f7f6f6',
        minWidth: 500,
        height: '100%',
    },

    title: {
        fontSize: 48,
        marginBottom: 0,
    },

    topBar: {
        minWidth: 750,
    },

    topBarLabelsContainer: {
        width: 675,
        height: '100%',
        position: 'absolute',
    },

    topBarLabelSpan: {
        display: 'block',
        marginTop: 5,
        fontSize: 24,
    },

    optionsButtonContainer: {
        position: 'absolute',
        right: 0,
        width: 72,
        height: 72,
        padding: 16,
    },

    optionsButtonIcon: {
        width: 48,
        height: 48,
        paddingRight: 10,
        position: 'relative',
        right: 3.5,
    },

    optionsMenuText: {
        color: black,
    },

    boardContainer: {
        width: 750, 
        height: 500, 
        margin: 'auto', 
        marginTop: 10, 
        marginBottom: 10
    },
};

const TopBarLabel = (props) => {
    const { topLabel, bottomLabel, left, right, isCenter, isHighlighted } = props;
    const style = {
        position: 'absolute',
        top: 0,
    };
    if (left) style.left = left;
    if (right) style.right = right;
    if (isCenter) { 
        style.position = 'relative';
        style.margin = 'auto';
    }
    const topLabelStyle = Object.assign({}, styles.topBarLabelSpan);
    if (isHighlighted) topLabelStyle.color = green300;

    return (
        <div style={style}>
            <span style={topLabelStyle}>{topLabel}</span>
            <span style={styles.topBarLabelSpan}>{bottomLabel}</span>
        </div>
    );
};

class GamePageComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            labelContainerLeft: 0,

            boardPaused: false,

            showOptionsMenu: false,
            optionsMenuAnchorEl: null,

            showGameOverDialog: false,
            showQuitDialog: false,
            showResetDialog: false,

            timeRemaining: props.timeLimit,

            game: new MemoryGame(this.props.boardSize, this.props.timeLimit, !props.isSinglePlayer),
        };

        this.timeInterval = null;

        this.handleOpenOptionsMenu.bind(this);
        this.handleCloseOptionsMenu.bind(this);
        this.handleOpenResetDialog.bind(this);
        this.handleCloseResetDialog.bind(this);
        this.handleOpenQuitDialog.bind(this);
        this.handleCloseQuitDialog.bind(this);
        this.handleCloseGameOverDialog.bind(this);
        this.handleResetGame.bind(this);
        this.handleCardClick.bind(this);
    }

    componentDidMount() {
        this.mounted = true;        

        window.addEventListener("resize", this.repositionLabelContainer);
        this.repositionLabelContainer();
        this.setState({optionsMenuAnchorEl: this.optionsButton});
        this.initializeTimer();
    }

    componentWillUnmount() {
        if (this.timeInterval) clearInterval(this.timeInterval);
        this.timeInterval = null;
        this.mounted = false;
    }

    handleOpenOptionsMenu = (event) => {
        // This prevents ghost click
        event.preventDefault();

        this.setState({
            showOptionsMenu: true,
            optionsMenuAnchorEl: event.currentTarget,
        });
    }

    handleCloseOptionsMenu = () => {
        this.setState({showOptionsMenu: false});
    }

    handleOpenResetDialog = () => {
        this.setState({showResetDialog: true, showOptionsMenu: false});
    }

    handleCloseResetDialog = () => {
        this.setState({showResetDialog: false});
    }

    handleOpenQuitDialog = () => {
        this.setState({showQuitDialog: true, showOptionsMenu: false});
    }

    handleCloseQuitDialog = () => {
        this.setState({showQuitDialog: false});
    }

    handleCloseGameOverDialog = () => {
        const game = this.state.game;
        
        if (game.isGameOver()) {
            this.props.onUpdateBestScore(game.getWinner()[1]);
        }
        
        this.setState({showGameOverDialog: false});
    }

    handleResetGame = () => {
        const game = this.state.game;

        if (game.isGameOver()) {
            this.props.onUpdateBestScore(game.getWinner()[1]);
        }

        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }

        game.resetGame();
        this.setState({
            game, 
            boardPaused: false, 
            showResetDialog: false, 
            showGameOverDialog: false,
            timeRemaining: this.props.timeLimit,
        }, () => this.initializeTimer());
    }

    handleCardClick = (i, j) => {
        const game = this.state.game;

        if (game.isCardFlippable(i, j) && !this.state.boardPaused) {
            const isFirstFlip = game.isFirstFlip();
            const isMatch = game.flipCard(i, j);
            const isGameOver = game.isGameOver();

            if (isGameOver) {
                if (this.timeInterval) clearInterval(this.timeInterval);
                this.timeInterval = null;
            }

            this.setState({game}, () => {
                if (isFirstFlip) return;
                if (!isMatch) {
                    this.setState({boardPaused: true}, () => {
                        setTimeout(() => {
                            game.resetFlippedCards();
                            this.setState({game, boardPaused: false});
                        }, this.props.waitTime);
                    });
                } 
                else {
                    game.changeTurn();
                    this.setState({game, showGameOverDialog: isGameOver});
                }
            });
        }
    }

    repositionLabelContainer = () => {
        if (!this.labelContainer) return;

        // Center the container label for the top bar
        const box = this.labelContainer.getBoundingClientRect();
        const parentBox = this.labelContainer.parentElement.getBoundingClientRect();
        const labelContainerLeft = (parentBox.width - box.width)/2.0;

        this.setState({labelContainerLeft});
    }

    initializeTimer = () => {
        this.timeInterval = setInterval(() => {
            if (this.state.timeRemaining <= 0) {
                if (this.mounted) this.setState({boardPaused: true, showGameOverDialog: true});

                clearInterval(this.timeInterval);
                this.timeInterval = null;
                return;
            }

            if (this.mounted) {
                this.setState((prevState) => {
                    return {
                        timeRemaining: Math.max(prevState.timeRemaining - 1, 0),
                    }
                });
            }
        }, 1000);
    }

    getGameOverStr() {
        const winner = this.state.game.getWinner();
        const isGameOver = this.state.game.isGameOver();
        let gameOverStr = '';        

        if (!isGameOver) {
            if (this.props.isSinglePlayer) gameOverStr = 'Time\'s up! You have a score of ' + winner[1] + '. Would you like to restart the game?';
            else if (winner[0] === 'Tie')  gameOverStr = 'Time\'s up! Score was a tie at ' + winner[1] + '. Would you like to restart the game?';
            else                           gameOverStr = 'Time\'s up! ' + winner[0] + ' wins with a score of ' + winner[1] + '. Would you like to restart the game?';
        } else {
            if (this.props.isSinglePlayer) gameOverStr = 'You received a score of ' + this.state.game.getScore('Player 1') + ' points. Would you like to restart the game?';
            else if (winner[0] === 'Tie')  gameOverStr = 'Game was a tie with a score of ' + winner[1] + '. Would you like to restart the game?';
            else                           gameOverStr = winner[0] + ' wins with a score of ' + winner[1] + '. Would you like to restart the game?';
        }
        return gameOverStr;
    }

    render() {
        const labelContainerStyle = Object.assign({}, styles.topBarLabelsContainer, {left: this.state.labelContainerLeft});
        const resetActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleCloseResetDialog}
            />,
            <RaisedButton
                label="OK"
                primary={true}
                onClick={this.handleResetGame}
                style={{marginLeft: 10}}
            />,
        ];
        const quitActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleCloseQuitDialog}
            />,
            <RaisedButton
                label="OK"
                primary={true}
                onClick={this.props.onQuit}
                style={{marginLeft: 10}}
            />,
        ];
        const gameOverActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleCloseGameOverDialog}
            />,
            <RaisedButton
                label="OK"
                primary={true}
                onClick={this.handleResetGame}
                style={{marginLeft: 10}}
            />,
        ];
        const isPlayerOneTurn = this.state.game.getCurrentPlayerTurn() === 'Player 1';      
        

        return (
            <div style={styles.content}>
                <AppBar style={styles.topBar} showMenuIconButton={false}>
                    <div style={labelContainerStyle} ref={labelContainer => this.labelContainer = labelContainer}>
                        <TopBarLabel topLabel="Player 1 Score:" bottomLabel={this.state.game.getScore('Player 1')} left="0%" isHighlighted={isPlayerOneTurn && !this.props.isSinglePlayer} />
                        <TopBarLabel topLabel="Time Left:" bottomLabel={getTimeStr(this.state.timeRemaining)} isCenter />
                        {this.props.isSinglePlayer ? null : <TopBarLabel topLabel="Player 2 Score:" bottomLabel={this.state.game.getScore('Player 2')} right="0%" isHighlighted={!isPlayerOneTurn} />}
                    </div>
                    <IconButton 
                        style={styles.optionsButtonContainer} 
                        iconStyle={styles.optionsButtonIcon} 
                        onClick={this.handleOpenOptionsMenu}
                        ref={button => this.optionsButton = button}
                    >
                        <MoreVert />
                    </IconButton>
                    <Popover
                        open={this.state.showOptionsMenu}
                        anchorEl={this.state.optionsMenuAnchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        onRequestClose={this.handleCloseOptionsMenu}
                    >
                        <Menu>
                            <MenuItem primaryText="Reset Game" style={styles.optionsMenuText} onClick={this.handleOpenResetDialog} />
                            <MenuItem primaryText="Quit" style={styles.optionsMenuText} onClick={this.handleOpenQuitDialog} />
                        </Menu>
                    </Popover>
                </AppBar>
                <div style={styles.boardContainer}>
                    <BoardComponent 
                        game={this.state.game} 
                        onCardClick={this.handleCardClick}
                    />
                </div>
                <Dialog
                    title="Quit Game?"
                    actions={quitActions}
                    modal={false}
                    open={this.state.showQuitDialog}
                    onRequestClose={this.handleCloseQuitDialog}
                    titleStyle={styles.optionsMenuText}
                    bodyStyle={styles.optionsMenuText}
                >
                    Are you sure you want to quit the current game? Progress will not be saved if you quit.
                </Dialog>
                <Dialog
                    title="Reset Game?"
                    actions={resetActions}
                    modal={false}
                    open={this.state.showResetDialog}
                    onRequestClose={this.handleCloseResetDialog}
                    titleStyle={styles.optionsMenuText}
                    bodyStyle={styles.optionsMenuText}
                >
                    Are you sure you want to reset the current game? Progress will not be saved and game will be restarted.
                </Dialog>
                <Dialog
                    title="Game Over!"
                    actions={gameOverActions}
                    modal={false}
                    open={this.state.showGameOverDialog}
                    onRequestClose={this.handleCloseGameOverDialog}
                    titleStyle={styles.optionsMenuText}
                    bodyStyle={styles.optionsMenuText}
                >
                    {this.getGameOverStr()}
                </Dialog>
            </div>
        );
    }
}

export default GamePageComponent;
