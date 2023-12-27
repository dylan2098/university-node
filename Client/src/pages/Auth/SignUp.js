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

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/active' } };

  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = async function (data) {
    if (data.password !== data.confirmPassword){
      alert('Confirm password incorrect!');
      return;
    }
    delete data.confirmPassword;
    try {
      const res = await axiosInstance.post('/auth/sign-up', data);
      if (res.data && res.data.status_code === 200) {
        localStorage.onlineCourse_accessToken = 'Bearer ' + res.data.data[0].access_token;
        localStorage.onlineCourse_displayName = res.data.data[0].full_name;
        localStorage.onlineCourse_id = res.data.data[0].id;
        localStorage.onlineCourse_role = res.data.data[0].role;
        history.replace(from);
      }
      else if (res.data){
        alert(res.data.message);
      } else {
        alert('Invalid login.');
      }
    } catch (err) {
      console.log(err.response);
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
          Sign Up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={register({ required: true })} autoFocus
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="full_name"
            label="Full Name"
            name="full_name"
            autoComplete="name"
            inputRef={register({ required: true })}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            inputRef={register({ required: true })}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register({ required: true })}
          />


          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="conformPassword"
            autoComplete="current-password"
            inputRef={register({ required: true })}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/sign-in">
                {"Do have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>

        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}