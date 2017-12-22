import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { black, blue500 } from 'material-ui/styles/colors';

const styles = {
    content: {
        textAlign: 'center',
        fontFamily: 'Chalkboard',
        color: '#f7f6f6',
        minWidth: 500,
    },

    title: {
        fontSize: 48,
        fontWeight: 'normal',
    },

    settingsContainer: {
        background: 'white',
        width: 500,
        margin: 'auto',
        marginBottom: 25,
    },

    settingsItem: {
        cursor: 'default',
    },

    settingsItemLabel: {
        color: black, 
        position: 'absolute', 
        left: 25, 
        top: 30,
        textAlign: 'left',
    },

    settingsHeader: {
        color: '#7a7a7a',
        textAlign: 'left',
        paddingLeft: 15,
    },

    radioButtonGroup: {
        marginLeft: '55%',
        width: '100%',
    },

    radioButton: {
        marginBottom: 16,
        width: '50%',
    },

    radioButtonLabel: {
        color: black,
        textAlign: 'left',
        marginLeft: 10,
    },

    dropdown: {
        marginLeft: '55%',
        width: 150,
    },
    
    dropdownLabel: {
        color: black,
    },

    buttonLeft: {
        width: 200,
        height: 50,
        marginRight: 15,
    },

    buttonLeftLabel: {
        fontSize: '130%',
        color: blue500,
    },

    buttonRight: {
        width: 200,
        height: 50,
        marginLeft: 15,
    },

    buttonLabel: {
        fontSize: '130%',
    },
};

/**
 * SettingsItem component
 * Represents an item available for user to configure different game options in.
 * @param {Object} props - React props passed in for SettingsItem
 */
const SettingsItem = (props) => {
    const { label, children } = props;

    return (
        <ListItem style={styles.settingsItem}>
            <span style={styles.settingsItemLabel}>{label}</span>
            {children}
        </ListItem>
    );
};

/**
 * SettingsPageComponent
 * Represents the overall settings UI with various items for users to configure game.
 */
class SettingsPageComponent extends Component {
    constructor(props) {
        super(props);

        const { timeLimit, difficulty } = props;

        this.state = {
            timeLimit,
            difficulty,
        };

        this.handleChangeDifficulty.bind(this);
        this.handleChangeTimeLimit.bind(this);
        this.handleAcceptSettings.bind(this);
        this.handleCancelSettings.bind(this);
    }

    /**
     * Changes saved difficulty (board size) for a game.
     */
    handleChangeDifficulty = (event, value) => {
        this.setState({difficulty: value});
    }

    /**
     * Changes saved time limit for a game.
     */
    handleChangeTimeLimit = (event, key, value) => {
        this.setState({timeLimit: value});
    }

    /**
     * All current settings options will be saved and be available for the next game played.
     */
    handleAcceptSettings = () => {
        this.props.onUpdateSettings(this.state.timeLimit, this.state.difficulty);
        this.props.onDoneSettings();
    }

    /**
     * Settings placed in current session will not be saved and previous settings options will be restored.
     */
    handleCancelSettings = () => {
        this.props.onDoneSettings();
    }

    render() {
        return (
            <div style={styles.content}>
                <h2 style={styles.title}>Settings</h2>
                <div style={styles.settingsContainer}>
                    <List>
                        <Subheader inset={true} style={styles.settingsHeader}>Game Options</Subheader>
                        <Divider />
                        <SettingsItem label="Difficulty (Board Size)">
                            <RadioButtonGroup 
                                name="difficulty" 
                                defaultSelected={this.state.difficulty} 
                                onChange={this.handleChangeDifficulty} 
                                style={styles.radioButtonGroup}
                            >
                                <RadioButton
                                    value={this.props.availableDifficulties.EASY}
                                    label={'Easy ' + this.props.availableDifficulties.EASY + 'x' + this.props.availableDifficulties.EASY}
                                    style={styles.radioButton}
                                    labelStyle={styles.radioButtonLabel}
                                />
                                <RadioButton
                                    value={this.props.availableDifficulties.MEDIUM}
                                    label={'Medium ' + this.props.availableDifficulties.MEDIUM + 'x' + this.props.availableDifficulties.MEDIUM}
                                    style={styles.radioButton}
                                    labelStyle={styles.radioButtonLabel}
                                />
                                <RadioButton
                                    value={this.props.availableDifficulties.HARD}
                                    label={'Hard ' + this.props.availableDifficulties.HARD + 'x' + this.props.availableDifficulties.HARD}
                                    style={styles.radioButton}
                                    labelStyle={styles.radioButtonLabel}
                                />
                            </RadioButtonGroup>
                        </SettingsItem>
                        <Divider />
                        <SettingsItem label="Time Limit">
                            <SelectField
                                value={this.state.timeLimit}
                                style={styles.dropdown}
                                labelStyle={styles.dropdownLabel}
                                menuItemStyle={styles.dropdownLabel}
                                onChange={this.handleChangeTimeLimit}
                            >
                                <MenuItem value={this.props.availableTimeLimits.THREE} primaryText="3 minutes" />
                                <MenuItem value={this.props.availableTimeLimits.FIVE} primaryText="5 minutes" />
                                <MenuItem value={this.props.availableTimeLimits.SEVEN} primaryText="7 minutes" />
                                <MenuItem value={this.props.availableTimeLimits.TEN} primaryText="10 minutes" />
                            </SelectField>
                        </SettingsItem>
                    </List>
                </div>
                <RaisedButton style={styles.buttonLeft} labelStyle={styles.buttonLeftLabel} label="Cancel" onClick={this.handleCancelSettings} />
                <RaisedButton style={styles.buttonRight} labelStyle={styles.buttonLabel} label="OK" primary onClick={this.handleAcceptSettings} />
            </div>
        );
    }
}

export default SettingsPageComponent;
