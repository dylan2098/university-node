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
  facebook: {
    backgroundColor: '#2067f7',
    margin: theme.spacing(3, 0, 2),
    color: 'white'
  },
  google: {
    backgroundColor: '#ef3737',
    margin: theme.spacing(3, 0, 2),
    color: 'white'
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();

  if (query.get('accessToken') && query.get('refreshToken') && query.get('displayName') && query.get('role') && query.get('id')) {
    localStorage.onlineCourse_accessToken = 'Bearer ' + query.get('accessToken');
    localStorage.onlineCourse_refreshToken = query.get('refreshToken');
    localStorage.onlineCourse_displayName = query.get('displayName');
    localStorage.onlineCourse_id = query.get('id');
    localStorage.onlineCourse_role = query.get('role');

    history.replace(from);
  }

  const { register, handleSubmit } = useForm();


  const onSubmit = async function (data) {
    try {
      const res = await axiosInstance.post('/auth', data);
      if (res && res.data.status_code === 200) {

        localStorage.onlineCourse_accessToken = 'Bearer ' + res.data.data[0].access_token;
        localStorage.onlineCourse_refreshToken = res.data.data[0].refresh_token;
        localStorage.onlineCourse_displayName = res.data.data[0].full_name;
        localStorage.onlineCourse_id = res.data.data[0].id;
        localStorage.onlineCourse_role = res.data.data[0].role;
        // history.push(from.pathname);
        history.replace(from);
      }
      else if (res.data) {
        alert(res.data.message);
      }
      else {
        alert('Invalid login.');
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
          Sign In
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
            autoFocus
            type="email"

            inputRef={register({ required: true })} autoFocus

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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>


          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="inherit"
            className={classes.google}
            onClick={event => window.location.href = 'http://localhost:5000/api/auth/google'}
          >
            Login with Google
          </Button>

          {/* <Button
            type="button"
            fullWidth
            variant="contained"
            color="second"
            className={classes.facebook}
          >
            Login with Facebook
          </Button> */}

          <Grid container>
            <Grid item xs>
              <Link to="/">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/sign-up">
                {"Don't have an account? Sign Up"}
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