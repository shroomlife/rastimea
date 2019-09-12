import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function Header() {
	return (
		<AppBar position="static" color="default" elevation={0}>
			<Toolbar>
				<img className="logo" src="/logo192.png" width="32" height="32" alt="" />
				<Typography variant="h6" color="inherit" noWrap>
					rastimea
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
