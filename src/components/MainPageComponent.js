import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    content: {
        textAlign: 'center',
        fontFamily: 'Chalkboard',
        color: '#f7f6f6',
        minWidth: 500,
    },

    title: {
        fontSize: 72,
        marginBottom: 0,
    },

    subtitle: {
        fontSize: 48,
        fontWeight: 'normal',
        marginTop: 10,
    },

    buttonContainer: {
        width: '100%',
        marginBottom: 25,
    },

    button: {
        width: 400,
        height: 75,
        position: 'relative',
    },

    buttonLabel: {
        fontSize: '130%',
    }
};

/**
 * MainPageButton component
 * Represents similar button format used in main page for navigation.
 * @param {Object} props - React props passed in for MainPageButton
 */
const MainPageButton = (props) => {
    const { label, onClick } = props;

    return (
        <div style={styles.buttonContainer}>
            <RaisedButton style={styles.button} labelStyle={styles.buttonLabel} label={label} primary onClick={onClick} />
        </div>
    );
};

/**
 * MainPageComponent
 * Represents overall layout for main page, along with buttons to navigate on different parts of Memory Game app.
 */
class MainPageComponent extends Component {
    render() {
        return (
            <div style={styles.content}>
                <h2 style={styles.title}>Memory Game</h2>
                <h3 style={styles.subtitle}>Best Score: {this.props.bestScore}</h3>
                <MainPageButton label="Start (One Player)" onClick={this.props.onOpenSinglePlayerGame} />
                <MainPageButton label="Start (Two Player)" onClick={this.props.onOpenMultiplayerGame} />
                <MainPageButton label="Settings" onClick={this.props.onOpenSettings} />
            </div>
        );
    }
}

export default MainPageComponent;
