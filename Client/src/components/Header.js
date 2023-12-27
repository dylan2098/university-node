import React, { useState, useEffect, useReducer } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import Components from './Index';
import MenuContext from '../context/menuAppContext';
import reducerMenu from '../reducer/reducer';
import { axiosInstance, parseJwt } from '../services/utils';
import moment from 'moment';
import { useForm } from 'react-hook-form';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    // position: 'absolute',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  linkRef: {
    textDecoration: 'none',
    color: 'white'
  }
}));


export default function Header(props) {

  const classes = useStyles();
  const history = useHistory();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: ''
    }
  });


  const accessToken = localStorage.onlineCourse_accessToken;
  const [displayName, setDisplayName] = useState(localStorage.onlineCourse_displayName);

  useEffect(() => {
    setDisplayName(localStorage.onlineCourse_displayName);
  }, [localStorage.onlineCourse_displayName])

  const initialAppState = {
    query: '',
    items: []
  }

  const [store, dispatch] = useReducer(reducerMenu, initialAppState);


  async function loadCategory() {
    const res = await axiosInstance.get(`/category/${props.initData}`);
    dispatch({
      type: 'init',
      payload: {
        items: res.data,
        query: ''
      }
    });
  }


  const checkToken = async () => {
    if (localStorage.onlineCourse_accessToken)
    {
      const arrayAccessToken = localStorage.onlineCourse_accessToken.split(' ');
      if (arrayAccessToken[1]) {
        const dataParseJwt = parseJwt(arrayAccessToken[1]);
        const now = moment().unix();

        if (now > dataParseJwt.exp || (dataParseJwt.exp - now <= 60 * 60 * 5)) {
          const dataRequest = {
            access_token: localStorage.onlineCourse_accessToken,
            refresh_token: localStorage.onlineCourse_refreshToken
          }

          const dataResponse = await axiosInstance.post('/auth/refresh', dataRequest);

          if (dataResponse.data.status_code === 200) {
            localStorage.onlineCourse_accessToken = 'Bearer ' + dataResponse.data.data[0];
          }
          else if(dataResponse.data){
            alert(dataResponse.data.message);
          }
        }
      }
    }
  }

  const onSubmit = async (data) => {
    let url = '/search';
    if (data.search !== '') {
      url += '?q=' + data.search;
    }
    history.push(url);
  }

  useEffect(function () {
    loadCategory();
    checkToken();
  }, [props.initData]);



  return (
    <div className={classes.root} id="header">
      <form id="formSearch" onSubmit={handleSubmit(onSubmit)} >
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              <Link to="/" className={classes.linkRef}>Online Courses</Link>
            </Typography>

            {
              (!localStorage.onlineCourse_role || localStorage.onlineCourse_role == 2) ? <>
                <Button className={classes.searchIcon} type="submit">
                  <SearchIcon />
                </Button>

                <div className={classes.search} >
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    name="search"
                    inputRef={register()}
                  />
                </div>
              </> : null
            }



                &nbsp; &nbsp; &nbsp;
                {
              !accessToken ? (
                <>
                  <Link to="/sign-in" className={classes.linkRef}> <Button color="inherit" > Sign In </Button> </Link>
                                      &nbsp;
                <Link to="/sign-up" className={classes.linkRef}><Button color="inherit"> Sign Up </Button> </Link>
                </>
              ) :
                <>
                  {displayName}
                  <Components.MoreInfo />
                </>
            }
          </Toolbar>
        </AppBar>
      </form>

      <MenuContext.Provider value={{ store, dispatch }}>
        <Components.Menu initQuery={0} />
      </MenuContext.Provider>
    </div>
  )
}
