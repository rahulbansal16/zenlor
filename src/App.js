import './App.less';
import { BrowserRouter as Router, Route, Switch,Redirect, Link } from "react-router-dom";
import Home from "./components/Home"
import Login from "./container/Login"
import StyleCodeEditor from './components/StyleCodeEditor';
import Header from './components/Header'
import {auth, useAuthState, AuthContextProvider} from './firebase';
import { useEffect } from 'react';
// import RedirectToLogin from './components/RedirectToLogin';

const AuthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState()
  console.log('The props in authenticatedRoute are', props)
  console.log(`AuthenticatedRoute: ${isAuthenticated}`)
  return (
    <Route
      {...props}
      render={routeProps =>
        isAuthenticated || (props.location && props.location.state && props.location.state.currentUser) ? <C {...routeProps} /> : <Redirect
        to={{
          pathname: "login",
          state: { source: props.path}
        }}/>
      }
    />
  )
}

const UnauthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState()
  console.log(`UnauthenticatedRoute: ${isAuthenticated}`)
  return (
    <Route
      {...props}
      render={routeProps =>
        !isAuthenticated ? <C {...routeProps} /> : <Redirect to="/" />
      }
    />
  )
}

const renderPages = () => {
  return (
    <Switch>
      <AuthenticatedRoute exact path="/" component={Home} />
      <UnauthenticatedRoute path="/login" component={Login} />
      <AuthenticatedRoute  path="/home" component = { ()  => <Home></Home>} />
      <AuthenticatedRoute path="/stylecode" component = { () => <StyleCodeEditor/>} />
    </Switch>

  )
}
function App() {
  useEffect( () => {
    console.log('The auth is', auth)
  },[])
  return (
    <div className="App">
      <AuthContextProvider>
        <Router>
        <div>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{' '}
          <Link to="/signup">SignUp</Link>
        </div>
          <Header/>
          {renderPages()}
        </Router>
      </AuthContextProvider>
    </div>
  );
}

export default App;
