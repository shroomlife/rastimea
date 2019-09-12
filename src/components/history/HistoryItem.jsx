import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import humanizeDuration from 'humanize-duration';
import { DEFAULT_HUMANIZE_DURATION_OPTION } from '../../helpers/constants';
import moment from 'moment';
import { getDuration } from '../../helpers/functions';
import Fab from '@material-ui/core/Fab';
import { MdEdit, MdHourglassEmpty, MdHourglassFull, MdSentimentVerySatisfied, MdDone, MdClose } from 'react-icons/md';

import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

export default class HistoryItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			historyItem: this.props.historyItem,
			edit: false,
			datepicker: {
				active: false
			}
		};

		this.toggleForm = this.toggleForm.bind(this);
		this.handleStartChange = this.handleStartChange.bind(this);
		this.handleEndChange = this.handleEndChange.bind(this);
		this.saveData = this.saveData.bind(this);
	}

	toggleForm() {
		this.setState({ edit: !this.state.edit });
	}

	handleStartChange(newMoment) {
		const currentState = Object.assign({}, this.state);
		currentState.historyItem.started = newMoment.toISOString();
		this.setState(currentState);
	}
	handleEndChange(newMoment) {
		const currentState = Object.assign({}, this.state);
		currentState.historyItem.ended = newMoment.toISOString();
		this.setState(currentState);
	}

	saveData() {
		this.props.handleHistoryItemChange(this.props.taskIndex, this.props.historyItemIndex, this.state.historyItem);
		this.toggleForm();
	}

	render() {
		const historyItem = this.state.historyItem;
		const startMoment = moment(historyItem.started);
		const endMoment = moment(historyItem.ended);
		const isEditing = this.state.edit;

		return (
			<Grid item xs={12}>
				<Paper className="taskItem historyItem">
					<Grid container>
						<Grid item xs={10} className="historyData">
							<Typography component="div" className="historyDataBlock">
								<MdHourglassEmpty />
								{!isEditing ? (
									<span>{startMoment.calendar()}</span>
								) : (
									<MuiPickersUtilsProvider utils={MomentUtils}>
										<DateTimePicker value={startMoment} onChange={this.handleStartChange} />
									</MuiPickersUtilsProvider>
								)}
							</Typography>
							<Typography component="div" className="historyDataBlock">
								<MdHourglassFull />
								{!isEditing ? (
									<span>{endMoment.calendar()}</span>
								) : (
									<MuiPickersUtilsProvider utils={MomentUtils}>
										<DateTimePicker value={endMoment} onChange={this.handleEndChange} />
									</MuiPickersUtilsProvider>
								)}
							</Typography>
							<Typography component="div" className="historyDataBlock">
								<MdSentimentVerySatisfied />
								<span>
									{humanizeDuration(getDuration(historyItem), DEFAULT_HUMANIZE_DURATION_OPTION)}
								</span>
							</Typography>
						</Grid>
						<Grid item xs={2} className="actionButtonContainer">
							{isEditing ? (
								<React.Fragment>
									<Fab size="small" color="primary" aria-label="save" onClick={this.saveData}>
										<MdDone />
									</Fab>
									<Fab size="small" color="secondary" aria-label="cancel" onClick={this.toggleForm}>
										<MdClose />
									</Fab>
								</React.Fragment>
							) : (
                <React.Fragment>
                <Tooltip title="Edit" placement="left">
								<Fab size="small" color="primary" aria-label="edit" onClick={this.toggleForm}>
									<MdEdit />
								</Fab>
																		</Tooltip>
                  <Tooltip title="Remove" placement="left">
																			<Fab
																				size="small"
																				color="secondary"
																				aria-label="remove"
																			>
																				<MdClose />
																			</Fab>
																		</Tooltip>
                </React.Fragment>
                
							)}
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		);
	}
}
