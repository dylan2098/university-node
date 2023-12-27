import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { axiosInstance, parseJwt } from '../../services/utils';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';

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

export default function Active() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = async function (data) {
    console.log(data);
    try {
      const res = await axiosInstance.post('/auth/active', data, {
        headers: {
            Authorization: localStorage.onlineCourse_accessToken
        },
    });
      if (res.data && res.data.status_code === 200) {
        history.push(from);
      } else {
        alert('Code active invalid.');
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
          Active
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="code"
            label="Code Active"
            name="code"
            autoComplete="code"
            inputRef={register({ required: true })} autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Active
          </Button>

        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}