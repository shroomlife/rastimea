import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import humanizeDuration from 'humanize-duration';

export default function History(props) {
	const task = props.task;

	if (!task.history.length) {
		return null;
	}

	return (
		<Grid container>
			<Grid item xs={12}>
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
				{task.history.map((historyItem, itemKey) => {
					return (
						<Grid item xs={12} key={itemKey}>
							<Paper className="taskItem">
								<Typography component="p">Started: {historyItem.started}</Typography>
								<Typography component="p">Ended: {historyItem.ended}</Typography>
								<Typography component="p">Duration: {humanizeDuration(historyItem.duration)}</Typography>
							</Paper>
						</Grid>
					);
				})}
			</div>
		</Grid>
	);
}
