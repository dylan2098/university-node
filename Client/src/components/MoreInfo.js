import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import { useHistory, Link } from 'react-router-dom';

export default function MoreInfo() {
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };


    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }


    const btnSignOut_Clicked = function () {
        delete localStorage.onlineCourse_accessToken;
        delete localStorage.onlineCourse_displayName;
        delete localStorage.onlineCourse_refreshToken;
        delete localStorage.onlineCourse_id;
        delete localStorage.onlineCourse_role;
        history.push('/sign-in');
    }

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    return (
        <>
            <IconButton
                aria-label="more"
                aria-haspopup="true"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                onClick={handleToggle}
            >
                <MoreVertIcon />
            </IconButton>

            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
                                    {parseInt(localStorage.onlineCourse_role) === 1 &&
                                        <MenuItem onClick={handleClose} component={Link} to="/my-upload-courses">My upload courses</MenuItem>
                                    }
                                    {parseInt(localStorage.onlineCourse_role) === 2 &&
                                        (
                                            <>
                                                <MenuItem onClick={handleClose} component={Link} to="/mycourses">My courses</MenuItem>
                                                <MenuItem onClick={handleClose} component={Link} to="/my-favorite-courses">My favorite courses</MenuItem>
                                                <MenuItem onClick={handleClose} component={Link} to="/my-learned-videos">My learned videos</MenuItem>
                                            </>
                                        )

                                    }
                                    {
                                        parseInt(localStorage.onlineCourse_role) === 0 &&
                                        <MenuItem onClick={handleClose} component={Link} to="/admin">Manage</MenuItem>
                                    }
                                    <MenuItem onClick={handleClose} component={Link} to="/change-password">Change Password</MenuItem>
                                    <MenuItem onClick={btnSignOut_Clicked}>Sign Out</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    )
}
