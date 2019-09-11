import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { Form } from '@rocketseat/unform';
import { TextField } from 'unform-material-ui';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { MdPlayArrow, MdStop, MdHistory, MdRemove } from 'react-icons/md';
import TimeAgo from 'react-timeago';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import moment from 'moment';

import humanizeDuration from 'humanize-duration';

import History from './History';

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
	return (
		<Grid item xs={12}>
			<Typography>Today</Typography>
			{task.history
				.filter((value, index) => {
					return moment().isSame(value.started, 'day');
				})
				.reverse()
				.map((value, index) => {
					const from = moment(value.started).format('H:s');
					const to = moment(value.ended).format('H:s');
					const duration = moment(value.ended) - moment(value.started);
					const humanizedDuration = humanizeDuration(duration);
					console.log(duration, humanizeDuration);
					return (
						<Typography key={index}>
							{from} => {to}
							<br />
							<small>duration: {humanizedDuration}</small>
						</Typography>
					);
				})}
		</Grid>
	);
};

class DurationCounter extends React.Component {

  constructor(props) {
    super(props);
    console.log("PROPS", props);
    this.state = {};
  }
	componentDidMount() {
		this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return <TimeAgo date={this.props.startTime} />;
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
		delete currentState.tasks[key];
		currentState.tasks = currentState.tasks.filter(() => {
			return true;
		});
		console.log(currentState.tasks);
		this.setState(currentState, this.onStateUpdated);
	}

	handleTaskStart(key) {
		const currentState = this.getCurrentStateObject();
		const newTask = currentState.tasks[key];

		newTask.started = moment();

		this.setState(currentState, this.onStateUpdated);
	}

	handleTaskStop(key) {
		const currentState = this.getCurrentStateObject();
		const newTask = currentState.tasks[key];

		const taskRunStarted = moment(newTask.started);
		const taskRunEnded = moment();
		const taskRunDuration = taskRunEnded - taskRunStarted;

		const newTaskRun = {
			started: taskRunStarted.format(),
			ended: taskRunEnded.format(),
			duration: taskRunDuration
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
														<Paper key={key} className="taskItem">
															<Grid container spacing={2}>
																<Grid item xs={7}>
																	<Typography variant="h5">{task.name}</Typography>

																	{isRunning ? (
																		<Typography component="p">
																			started{' '}
																			<DurationCounter startTime={task.started} />
																		</Typography>
																	) : hasHistory ? (
																		<Typography component="p">
																			last ended{' '}
																			{moment(lastLog.ended).format('Y/M/D, H:m:s')}
																			<small>{humanizeDuration(lastLog.duration)}</small>
																		</Typography>
																	) : null}
																</Grid>
																<Grid item xs={5} className="actionButtonContainer">
																	{!isRunning ? (
																		<Button
																			variant="contained"
																			color="primary"
																			onClick={() => {
																				this.handleTaskStart(key);
																			}}
																		>
																			<MdPlayArrow /> Start
																		</Button>
																	) : null}
																	{isRunning ? (
																		<Button
																			variant="contained"
																			color="secondary"
																			onClick={() => {
																				this.handleTaskStop(key);
																			}}
																		>
																			<MdStop /> Stop
																		</Button>
																	) : null}
																	{hasHistory ? (
																		<Button
																			variant="contained"
																			color="default"
																			onClick={() => {
																				props.history.push(`/history/${key}/`);
																			}}
																		>
																			<MdHistory /> History
																		</Button>
																	) : null}
																	{!isRunning ? (
																		<Button
																			variant="contained"
																			color="secondary"
																			onClick={() => {
																				this.handleRemoveTask(key);
																			}}
																		>
																			<MdRemove /> Remove
																		</Button>
																	) : null}
																</Grid>
																{hasHistory ? <DetailDailyView task={task} /> : null}
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
							render={(props) => <History {...props} task={this.state.tasks[props.match.params.key]} />}
						/>
					</Router>
				</Container>
			</React.Fragment>
		);
	}
}
