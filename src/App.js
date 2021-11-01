import './App.less';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import Login from "./container/Login"
import StyleCodeEditor from './components/StyleCodeEditor';
import TaskEditor from './components/TaskEditor';
import Header from './components/Header'
import {auth, functions} from './firebase';
import { useEffect, useState} from 'react';
import RedirectToLogin from './components/RedirectToLogin';
import Tasks from './components/Tasks';
import Task from './components/Task';
import TaskHome from './components/TaskHome';
import { getTimeStampAhead } from './util';
import CONSTANTS from './CONSTANTS';

const renderPages = (inCompleteTasks, completeTasks) => {
  return (
    <Switch>
      <Route exact path = "/" render = { () => <TaskHome inCompleteTasks={inCompleteTasks} completeTasks = {completeTasks}/>} />
      <Route exact path = "/stylecodes" render = { () => <Home/>} />
      <Route exact path = "/stylecode" render = { () => <StyleCodeEditor/>} />
      <Route exact path = "/stylecode/:styleCodeId/task/edit" render = { (props) => <TaskEditor styleCodeId={props.match.params.styleCodeId}/>} />
      <Route exact path ="/task/:styleCodeId/:taskId" render = { (props) => <Task styleCodeId={props.match.params.styleCodeId} taskId={props.match.params.taskId}/>} />
      {/* <Route exact path ="/tasks" render = { () => <Tasks status = {"incomplete"} shouldRemoveDependentTask={false} taskTillDate={getTimeStampAhead(200)}/>}/> */}
      <Route exact path = "/login" render = { () => <Login/>} />
    </Switch>

  )
}
function App() {

  const [completeTasks, setCompleteTasks] = useState([])
  const [incompleteTasks, setIncompleteTasks] = useState([])
  useEffect( () => {
    fetchIncompleteTasks()
    fetchCompleteTasks()
  },[])

  const fetchIncompleteTasks = async () => {
    let fetchTasks = functions.httpsCallable('fetchTasks')
    let tasks = await fetchTasks({companyId: CONSTANTS.companyId, shouldRemoveDependentTask: true, dueDate: getTimeStampAhead(0)})
    setIncompleteTasks(tasks.data)
  }

  const fetchCompleteTasks = async () => {
    let completedTasks = functions.httpsCallable('completedTasks')
    let tasks = await completedTasks({companyId: CONSTANTS.companyId })
    setCompleteTasks(tasks.data)
  }
  return (
    <div className="App">
      <Router>
        <Header/>
        {renderPages(incompleteTasks, completeTasks)}
      </Router>
    </div>
  );
}

export default App;
