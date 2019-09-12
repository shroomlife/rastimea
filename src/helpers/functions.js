import moment from 'moment';

// get duration from task object
const getDuration = (task) => {
	const started = moment(task.started);
	const ended = moment(task.ended);
	return ended - started;
};

export {
  getDuration
}
