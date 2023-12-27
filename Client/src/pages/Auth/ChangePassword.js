import React from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../services/utils';
import { Link } from 'react-router-dom';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'© 2021, '}
      <Link color="inherit" to="/">
        Nhom 7 - Online Courses
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ChangePassword() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  const { register, handleSubmit } = useForm();


  const onSubmit = async function (data) {
    try {
      console.log(data);
      const res = await axiosInstance.post('/auth/change-password', data, {
        headers: {
            Authorization: localStorage.onlineCourse_accessToken
        },
        });

      if (res && res.data.status_code === 200) {
        alert("Change password success!");
        history.replace(from);
      } else {
        alert('Change password fail!');
      }
    } catch (err) {
      console.log(err.response.data);
    }
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change password
        </Typography>

        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            inputRef={register({ required: true })}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="new_password"
            label="New password"
            type="password"
            id="new_password"
            inputRef={register({ required: true })}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="repeat_new_password"
            label="Repeat new password"
            type="password"
            id="repeat_new_password"
            inputRef={register({ required: true })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Change password
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}