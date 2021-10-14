import './App.less';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import Login from "./container/Login"
import StyleCodeEditor from './components/StyleCodeEditor';
import Header from './components/Header'
import {auth} from './firebase';
import { useEffect } from 'react';
import RedirectToLogin from './components/RedirectToLogin';
import Tasks from './components/Tasks';
import Task from './components/Task';

const renderPages = () => {
  return (
    <Switch>
      <Route exact path = "/" render = { () => <Home></Home>} />
      <Route exact path = "/home" render = { () => <Home></Home>} />
      <Route exact path = "/stylecode" render = { () => <StyleCodeEditor/>} />
      <Route exact path ="/task/:styleCodeId/:taskId" render = { (props) => <Task styleCodeId={props.match.params.styleCodeId} taskId={props.match.params.taskId}/>} />
      <Route exact path ="/tasks" render = { () => <Tasks/>}/>
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
        <Header/>
        {renderPages()}
      </Router>
    </div>
  );
}

export default App;
