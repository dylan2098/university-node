import React from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    linkRef: {
        textDecoration: 'none',
    },
    clearBottom: {
        marginTop: 80
    }
}));



export default function Footer() {
    const classes = useStyles();


    return (
        <div className={classes.clearBottom}>
            <AppBar id="footer" color="primary" style={{ top: "auto", bottom: 0, width: '100%' }}>
                <BottomNavigation value={0}>
                    <BottomNavigationAction label=" © 2021, Nhom 7 - Online Courses" />
                </BottomNavigation>
            </AppBar>
        </div>
    );
}
