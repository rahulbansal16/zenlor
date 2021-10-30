import './App.less';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import Login from "./container/Login"
import StyleCodeEditor from './components/StyleCodeEditor';
import TaskEditor from './components/TaskEditor';
import Header from './components/Header'
import {auth} from './firebase';
import { useEffect } from 'react';
import RedirectToLogin from './components/RedirectToLogin';
import Tasks from './components/Tasks';
import Task from './components/Task';
import TaskHome from './components/TaskHome';
import { getTimeStampAhead } from './util';

const renderPages = () => {
  return (
    <Switch>
      <Route exact path = "/" render = { () => <TaskHome/>} />
      <Route exact path = "/stylecodes" render = { () => <Home/>} />
      <Route exact path = "/stylecode" render = { () => <StyleCodeEditor/>} />
      <Route exact path = "/stylecode/:styleCodeId/task/edit" render = { (props) => <TaskEditor styleCodeId={props.match.params.styleCodeId}/>} />
      <Route exact path ="/task/:styleCodeId/:taskId" render = { (props) => <Task styleCodeId={props.match.params.styleCodeId} taskId={props.match.params.taskId}/>} />
      <Route exact path ="/tasks" render = { () => <Tasks status = {"incomplete"} taskTillDate={getTimeStampAhead(200)}/>}/>
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
