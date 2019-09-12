import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { MdAvTimer, MdList } from 'react-icons/md';
import humanizeDuration from 'humanize-duration';
import { DEFAULT_HUMANIZE_DURATION_OPTION } from '../../helpers/constants';

import HistoryItem from './HistoryItem';
import { getDuration } from '../../helpers/functions';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

const History = (props) => {
	const taskIndex = props.match.params.key;
	const task = props.task;

	if (!task.history.length) {
		return null;
	}

	let dailyHistory = {};

	task.history.forEach((historyItem, itemKey) => {
		const currentDay = moment(historyItem.started).format('YYYY-MM-DD');

		if (typeof dailyHistory[currentDay] === 'undefined') {
			dailyHistory[currentDay] = {
				items: [],
				totalLogged: 0
			};
		}

		historyItem.historyIndex = itemKey;

		dailyHistory[currentDay].items = dailyHistory[currentDay].items.concat(historyItem);

		const duration = getDuration(historyItem);

		dailyHistory[currentDay].totalLogged += duration;
	});

	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography variant="h4">{task.name}</Typography>
			</Grid>
			<Grid item xs={6} align="right">
				<Button
					variant="contained"
					color="default"
					onClick={() => {
						props.history.push('/');
					}}
				>
					go back
				</Button>
			</Grid>
			<div className="taskList">
				{Object.entries(dailyHistory).reverse().map(([ dayIndex, dayItem ]) => {
					const isToday = moment(dayIndex).isSame(moment(), 'day');
					const dayCount = dayItem.items.length;

					return (
						<Grid key={dayIndex} container>
							<Grid item xs={5}>
								<Typography variant="h6">{dayIndex}</Typography>
							</Grid>
							<Grid item xs={2} align="center">
								{isToday ? <Chip label="Today" size="small" color="primary" /> : null}
							</Grid>
							<Grid item xs={5} className="historyChips" align="right">
								<Chip
									avatar={
										<Avatar>
											<MdAvTimer />
										</Avatar>
									}
									label={humanizeDuration(dayItem.totalLogged, DEFAULT_HUMANIZE_DURATION_OPTION)}
									size="small"
								/>
								<Chip
									avatar={
										<Avatar>
											<MdList />
										</Avatar>
									}
									label={`${dayCount}`}
									size="small"
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider />
								{dayItem.items.reverse().map((historyItem, itemKey) => {
									return (
										<React.Fragment key={itemKey}>
											<HistoryItem
												taskIndex={taskIndex}
												key={itemKey}
												historyItemIndex={historyItem.historyIndex}
												historyItem={historyItem}
												handleHistoryItemChange={props.handleHistoryItemChange}
											/>
										</React.Fragment>
									);
								})}
							</Grid>
						</Grid>
					);
				})}
			</div>
		</Grid>
	);
};

export default History;
