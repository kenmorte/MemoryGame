import React, { Component } from 'react';
import { blue500, black } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MainPageComponent from './components/MainPageComponent';
import GamePageComponent from './components/GamePageComponent';
import SettingsPageComponent from './components/SettingsPageComponent';

const styles ={
  background: {
    width: '100%',
    height: '100%',
  },
};

/**
 * Material-UI overall theme colors. Easier use of customizing button, font, etc. styles.
 */
const muiTheme = getMuiTheme({
	fontFamily: 'Chalkboard',

	palette: {
		textColor: '#f7f6f6',
		primary1Color: blue500,
		primary2Color: black,
		primary3Color: black,
		accent1Color: blue500,
	},

	appBar: {
		height: 75,
	},
});


class App extends Component {
	constructor(props) {
		super(props);

		// Screens available in app
		this.pages = {
			MAIN: 0,  // Main menu screen
			GAME: 1,  // Game page w/cards
			SETTINGS: 2,  // Settings page for options
		};

		// Time limits allowed for the game
		this.timeLimits = {
			THREE: 180,
			FIVE: 300,
			SEVEN: 420,
			TEN: 600,
		};

		// Difficulties for board size
		this.difficulty = {
			EASY: 4,	// 4x4
			MEDIUM: 6,	// 6x6
			HARD: 8,	// 8x8
		};

		// User has 1 second to review board layout after flipping non-matching cards
		this.flipWaitTime = 1000;

		this.state = {

			// State for current page shown, refer to this.pages for all pages available
			pageShown: this.pages.MAIN,

			// State for current game mode (changed depending on game mode that is clicked by user)
			isSinglePlayer: false,

			// State for what time limit is for each game (default is 5 minutes)
			timeLimit: this.timeLimits.FIVE,

			// State for what difficulty (board size) for each game
			difficulty: this.difficulty.EASY,

			// Keeping track of top score received in current session
			bestScore: 0,
		};

		this.handleOpenSinglePlayerGame.bind(this);
		this.handleOpenMultiplayerGame.bind(this);
		this.handleUpdateSettings.bind(this);
		this.handleOpenSettings.bind(this);
		this.handleOpenMainPage.bind(this);
		this.handleUpdateBestScore.bind(this);
	}

	/**
	 * Switches screen to the main page.
	 */
	handleOpenMainPage = () => {
		this.setState({pageShown: this.pages.MAIN});
	}

	/**
	 * Switches screen to the game page in single player mode.
	 */
	handleOpenSinglePlayerGame = () => {
		// First set game mode to single player, then open game pad
		this.setState({isSinglePlayer: true}, () => this.setState({pageShown: this.pages.GAME}));
	}

	/**
	 * Switches screen to the game page in multiplayer mode.
	 */
	handleOpenMultiplayerGame = () => {
		// First set game mode to multiplayer, then open game pad
		this.setState({isSinglePlayer: false}, () => this.setState({pageShown: this.pages.GAME}));
	}

	/**
	 * Switches screen to the settings page.
	 */
	handleOpenSettings = () => {
		this.setState({pageShown: this.pages.SETTINGS});
	}

	/**
	 * Update settings with new options based on what user specified on settings page.
	 */
	handleUpdateSettings = (timeLimit, difficulty) => {
		this.setState({timeLimit, difficulty});
	}

	/**
	 * Update best score with the max of current best score and other score reached.
	 */
	handleUpdateBestScore = (score) => {
		this.setState((prevState) => {
			return { bestScore: Math.max(prevState.bestScore, score) };
		});
	}

	/**
	 * Return page content depending on what page should be displayed.
	 */
	renderContent() {
		switch(this.state.pageShown) {

			// Main Page
			case this.pages.MAIN: 
				return (
					<MainPageComponent 
						bestScore={this.state.bestScore}
						onOpenSinglePlayerGame={this.handleOpenSinglePlayerGame}
						onOpenMultiplayerGame={this.handleOpenMultiplayerGame}
						onOpenSettings={this.handleOpenSettings}
					/>
				);

			// Settings Page
			case this.pages.SETTINGS:
				return (
					<SettingsPageComponent 
						availableDifficulties={this.difficulty}
						availableTimeLimits={this.timeLimits}
						timeLimit={this.state.timeLimit} 
						difficulty={this.state.difficulty} 
						onUpdateSettings={this.handleUpdateSettings} 
						onDoneSettings={this.handleOpenMainPage}
					/> 
				);

			// Game Page
			case this.pages.GAME:
				return (
					<GamePageComponent
						timeLimit={this.state.timeLimit}
						boardSize={this.state.difficulty}
						waitTime={this.flipWaitTime}
						isSinglePlayer={this.state.isSinglePlayer}
						onUpdateBestScore={this.handleUpdateBestScore}
						onQuit={this.handleOpenMainPage}
					/>
				);

			// Invalid Page
			default: return null;
		}
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.background}>
					{this.renderContent()}
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
