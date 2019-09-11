import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';

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
							<Paper className="taskItem historyItem">
                
		<Grid container>
      <Grid item xs={6}>
        <Typography component="strong">Start</Typography>
        <Typography component="p">{moment(historyItem.started).calendar()}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography component="strong">Ended</Typography>
        <Typography component="p">{moment(historyItem.ended).calendar()}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography component="p" className="duration">Duration: {humanizeDuration(historyItem.duration)}</Typography>
      </Grid>
    </Grid>
							</Paper>
						</Grid>
					);
				})}
			</div>
		</Grid>
	);
}

const defaultMomentDateFormat = "";
