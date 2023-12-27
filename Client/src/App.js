import './App.scss';
import Component from './components/Index';
import Page from './pages/Index';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#039be5',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    }
  }
});


function App() {
  return (
    <ThemeProvider theme={theme}>

      <Router>
        <Switch>
          <Route path="/sign-in">
            <Page.SignIn />
          </Route>

          <Route path="/sign-up">
            <Page.SignUp />
          </Route>

          <Route path="/active">
            <Page.Active />
          </Route>

          <Route path="/change-password">
            <Page.ChangePassword />
          </Route>

          <Route path="/search">
            <Component.Header />
            <Page.SearchCourse />
            <Component.Footer />
          </Route>

          <Route path="/item/:id">
            <Component.Header />
            <Page.DetailCourse />
            <Component.Footer />
          </Route>

          <Route path="/category/:id">
            <Component.Header />
            <Page.ListCourses />
            <Component.Footer />
          </Route>

          <Route path="/category/0">
            <Component.Header initData={0} />
            <Page.Home />
            <Component.Footer />
          </Route>

          <PrivateRoute path="/add-lesson/:idCourse">
            <Component.Header />
            <Component.AddLesson />
            <Component.Footer />
          </PrivateRoute>

          <PrivateRoute path="/update-lesson/:id">
            <Component.Header />
            <Component.UpdateLesson />
            <Component.Footer />
          </PrivateRoute>



          <PrivateRoute path="/course/:idCourse/lesson/:idLesson">
            <Page.ListVideo />
            <Component.Footer />
          </PrivateRoute>

          <PrivateRoute path="/mycourses">
            <Component.Header />
            <Page.MyCourses />
            <Component.Footer />
          </PrivateRoute>

          <PrivateRoute path="/admin/category/:id">
            <Component.Header />
            <Component.UpdateCategory />
            <Component.Footer />
          </PrivateRoute>


          <PrivateRoute path="/admin">
            <Component.Header />
            <Page.MyAdmin />
            <Component.Footer />
          </PrivateRoute>


          <PrivateRoute path="/my-upload-courses">
            <Component.Header />
            <Page.MyUploadCourses />
            <Component.Footer />
          </PrivateRoute>

          <PrivateRoute path="/my-favorite-courses">
            <Component.Header />
            <Page.MyFavoriteCourses />
            <Component.Footer />
          </PrivateRoute>

          <PrivateRoute path="/my-learned-videos">
            <Component.Header />
            <Page.LearnedVideos />
            <Component.Footer />
          </PrivateRoute>

         
          <PrivateRoute path="/profile">
            <Component.Header />
            <Page.UserProfile />
            <Component.Footer />
          </PrivateRoute>

          <Route path="/">
            <Component.Header initData={0} />
            <Page.Home />
            <Component.Footer />
          </Route>
        </Switch>
      </Router>

    </ThemeProvider >
  );



  function PrivateRoute({ children, ...rest }) {
    const renderChildren = function ({ location, path }) {
      if (path === '/'){
        return (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location }
            }}
          />
        )
      }
      return localStorage.onlineCourse_accessToken ? children : (
        <Redirect
          to={{
            pathname: '/sign-in',
            state: { from: location }
          }}
        />
      );
    }

    return (
      <Route {...rest} render={renderChildren} />
    );
  }
}

export default App;
