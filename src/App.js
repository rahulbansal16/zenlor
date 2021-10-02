import './App.less';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import Login from "./container/Login"
import StyleCodeEditor from './components/StyleCodeEditor';
import {auth} from './firebase';
import { useEffect } from 'react';

const renderPages = () => {
  return (
    <Switch>
      <Route exact path = "/" render = { () => <Home></Home>} />
      <Route exact path = "/stylecode" render = { () => <StyleCodeEditor/>} />
      <Route exact path = "/login" render = { () => <Login/>} />
    </Switch>

  )
}
function App() {
  useEffect( () => {
    console.log('The auth is', auth)
  },[])
  return (
    <div className="App">
      <Router>
        {renderPages()}
      </Router>
    </div>
  );
}

export default App;
