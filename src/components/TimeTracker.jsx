import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { Form } from '@rocketseat/unform';
import { TextField } from 'unform-material-ui';
import Fab from '@material-ui/core/Fab';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { MdPlayArrow, MdStop, MdHistory, MdClose, MdToday, MdLastPage, MdAvTimer } from 'react-icons/md';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import moment from 'moment';

import humanizeDuration from 'humanize-duration';

import History from './history/History';

import { getDuration } from '../helpers/functions';
import { DEFAULT_HUMANIZE_DURATION_OPTION } from '../helpers/constants';

import Swal from 'sweetalert2';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

const INITIAL_STATE = {
	tasks: []
};

const INITIAL_TASK = {
	name: '',
	started: false,
	history: []
};

const STORAGE_NAME = 'STORAGE_rastimea';

const DetailDailyView = ({ task }) => {
	const todayDone = task.history.filter((value, index) => {
		return moment().isSame(value.started, 'day');
	});

	if (todayDone.length === 0) {
		return null;
	}

	let totalToday = 0;
	todayDone.forEach((task, index) => {
		totalToday += getDuration(task);
	});

	return (
		<Tooltip title="total duration today" placement="top">
			<Chip
				label={humanizeDuration(totalToday, DEFAULT_HUMANIZE_DURATION_OPTION)}
				size="small"
				color="primary"
				avatar={
					<Avatar>
						<MdToday />
					</Avatar>
				}
				variant="outlined"
			/>
		</Tooltip>
	);
};

class DurationCounter extends React.Component {
	constructor(props) {
		super(props);
		console.log('PROPS', props);
		this.state = {};
	}
	componentDidMount() {
		this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {

		const startTimeDate = moment(this.props.startTime);
		const duration = moment() - startTimeDate;
		const countdownString = humanizeDuration(duration, DEFAULT_HUMANIZE_DURATION_OPTION);

		return (
			<Tooltip title="currently running" placement="top">
				<Chip
					label={countdownString}
					color="secondary"
					size="small"
					avatar={
						<Avatar>
							<MdPlayArrow />
						</Avatar>
					}
				/>
			</Tooltip>
		);
	}
}

export default class TimeTracker extends React.Component {
	constructor(props) {
		super(props);

		let loadedData = localStorage.getItem(STORAGE_NAME);
		let parsedState = JSON.parse(loadedData);

		console.log(parsedState);
		if (loadedData) {
			this.state = parsedState;
		} else {
			this.state = Object.assign({}, INITIAL_STATE);
		}

		this.handleAddNewTask = this.handleAddNewTask.bind(this);
		this.handleTaskStart = this.handleTaskStart.bind(this);
		this.handleTaskStop = this.handleTaskStop.bind(this);
		this.handleRemoveTask = this.handleRemoveTask.bind(this);
		this.handleHistoryItemChange = this.handleHistoryItemChange.bind(this);

		this.addNewTaskForm = React.createRef();
	}

	getCurrentStateObject() {
		return Object.assign({}, this.state);
	}

	handleAddNewTask(data, form) {
		const currentState = this.getCurrentStateObject();
		const newTask = Object.assign({}, INITIAL_TASK);

		newTask.name = data.name;

		currentState.tasks.push(newTask);

		this.setState(currentState, this.onStateUpdated);
		form.resetForm();
	}

	handleRemoveTask(key) {
		const currentState = this.getCurrentStateObject();
		const currentTask = currentState.tasks[key];

		Swal.fire({
			title: `really delete ${currentTask.name}`,
			type: 'warning',
			showCancelButton: true,
			focusConfirm: false,
			confirmButtonColor: '#f50057',
			cancelButtonColor: '#e0e0e0'
		}).then((result) => {
			if (result.value) {
				delete currentState.tasks[key];
				currentState.tasks = currentState.tasks.filter(() => {
					return true;
				});
				console.log(currentState.tasks);
				this.setState(currentState, this.onStateUpdated);

				Swal.fire('Deleted!', `${currentTask.name} has been removed`, 'success');
			}
		});
	}

	handleHistoryItemChange(taskIndex, historyIndex, newData) {
		let currentState = this.getCurrentStateObject();
		currentState.tasks[taskIndex].history[historyIndex] = newData;
		this.setState(currentState, this.onStateUpdated);
	}

	handleTaskStart(key) {
		let currentState = this.getCurrentStateObject();
		const newTask = currentState.tasks[key];

		newTask.started = moment();

		this.setState(currentState, this.onStateUpdated);
	}

	handleTaskStop(key) {
		let currentState = this.getCurrentStateObject();
		const newTask = currentState.tasks[key];

		const taskRunStarted = moment(newTask.started);
		const taskRunEnded = moment();

		const newTaskRun = {
			started: taskRunStarted.format(),
			ended: taskRunEnded.format()
		};

		newTask.started = false;

		newTask.history = newTask.history.concat([ newTaskRun ]);

		this.setState(currentState, this.onStateUpdated);
	}

	clearTasks() {
		localStorage.removeItem(STORAGE_NAME);
		this.setState({ ...INITIAL_STATE });
	}

	onStateUpdated() {
		console.log('NEW STATE', this.state);
		localStorage.setItem(STORAGE_NAME, JSON.stringify(this.state));
	}

	render() {
		return (
			<React.Fragment>
				<CssBaseline />
				<Container component="main" maxWidth="md" className="content">
					<Router>
						<Route
							path="/"
							exact
							render={(props) => {
								return (
									<Grid container>
										<Grid item xs={12}>
											<Typography variant="h4">My Tasks</Typography>
										</Grid>
										<div className="taskList">
											<Grid item xs={12}>
												{this.state.tasks.map((task, key) => {
													const isRunning = task.started !== false;
													const historyLength = task.history.length;
													const hasHistory = historyLength > 0;

													let lastLog = false;

													if (hasHistory) {
														lastLog = task.history[historyLength - 1];
													}

													return (
														<Paper
															key={key}
															className={[
																'taskItem',
																isRunning ? 'running' : null
															].join(' ')}
														>
															<Grid container spacing={2}>
																<Grid item xs={9} className="taskCurrentData">
																	<Typography variant="h5">{task.name}</Typography>

																	{isRunning ? (
																		<DurationCounter startTime={task.started} />
																	) : null}
																	{hasHistory ? (
																		<React.Fragment>
																			<Tooltip title="last ended" placement="top">
																				<Chip
																					label={moment(
																						lastLog.ended
																					).calendar()}
																					size="small"
																					avatar={
																						<Avatar>
																							<MdLastPage />
																						</Avatar>
																					}
																					variant="outlined"
																				/>
																			</Tooltip>
																			<Tooltip
																				title="last duration"
																				placement="top"
																			>
																				<Chip
																					label={humanizeDuration(
																						getDuration(lastLog),
																						DEFAULT_HUMANIZE_DURATION_OPTION
																					)}
																					size="small"
																					avatar={
																						<Avatar>
																							<MdAvTimer />
																						</Avatar>
																					}
																					variant="outlined"
																				/>
																			</Tooltip>
																		</React.Fragment>
																	) : null}
																	{hasHistory ? (
																		<DetailDailyView task={task} />
																	) : null}
																</Grid>
																<Grid item xs={3} className="actionButtonContainer">
																	{!isRunning ? (
																		<Tooltip title="Start" placement="left">
																			<Fab
																				size="small"
																				color="primary"
																				aria-label="start"
																				onClick={() => {
																					this.handleTaskStart(key);
																				}}
																			>
																				<MdPlayArrow />
																			</Fab>
																		</Tooltip>
																	) : null}
																	{isRunning ? (
																		<Tooltip title="Stop" placement="left">
																			<Fab
																				size="small"
																				color="secondary"
																				aria-label="stop"
																				onClick={() => {
																					this.handleTaskStop(key);
																				}}
																			>
																				<MdStop />
																			</Fab>
																		</Tooltip>
																	) : null}
																	{hasHistory ? (
																		<Tooltip title="History" placement="left">
																			<Fab
																				size="small"
																				color="default"
																				aria-label="history"
																				onClick={() => {
																					props.history.push(
																						`/history/${key}/`
																					);
																				}}
																			>
																				<MdHistory />
																			</Fab>
																		</Tooltip>
																	) : null}
																	{!isRunning ? (
																		<Tooltip title="Remove" placement="left">
																			<Fab
																				size="small"
																				color="secondary"
																				aria-label="remove"
																				onClick={() => {
																					this.handleRemoveTask(key);
																				}}
																			>
																				<MdClose />
																			</Fab>
																		</Tooltip>
																	) : null}
																</Grid>
															</Grid>
														</Paper>
													);
												})}
											</Grid>
										</div>
										<Grid item xs={12}>
											<Form onSubmit={this.handleAddNewTask}>
												<Typography variant="h6">New Task</Typography>
												<Grid container spacing={3}>
													<Grid item xs={12}>
														<TextField name="name" placeholder="Task Name" required />
													</Grid>
													<Grid item xs={12}>
														<Button variant="contained" type="submit" color="primary">
															add
														</Button>
													</Grid>
												</Grid>
											</Form>
										</Grid>
									</Grid>
								);
							}}
						/>
						<Route
							path="/history/:key"
							render={(props) => (
								<History
									{...props}
									handleHistoryItemChange={this.handleHistoryItemChange}
									task={this.state.tasks[props.match.params.key]}
								/>
							)}
						/>
					</Router>
				</Container>
			</React.Fragment>
		);
	}
}
