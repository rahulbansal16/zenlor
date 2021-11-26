import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.less';
import Authorization from "./auth/Authorization";
import Logout from "./auth/Logout";
import Header from './components/Header';
import Login from "./container/Login";
import { auth, functions, getData } from "./firebase";
import Department from "./forms/dataEntry/Department";
import EditForm from "./forms/EditForm";
import FormLoader from './forms/FormLoader';
import Home from "./forms/Home";
import ProcessForm from './forms/ProcessForm';
import { fetchDataAction, udpateRole, updateAuth } from "./redux/actions";

const renderPages = () => {
  return (
    <Switch>
      <Route exact path="/" render = { (props) => <Department/>} />
      <Route exact path="/logout" render = { (props) => <Logout/>} /> 
      <Route exact path="/login" render = {() => <Login/>} />
      <Route exact path="/:department">
         { (props) => <Authorization allowedRoles={["admin", "manager"]} department = {props.match.params.department}> 
            <Home department={props.match.params.department}/>
          </Authorization>
        } 
      </Route>
      <Route exact path="/:department/form/edit" render = { (props) => <EditForm department = {props.match.params.department} />} />
      <Route exact path="/:department/form" render = { (props) => <FormLoader department = {props.match.params.department} />} />
      <Route exact path="/:department/process/form" render = { (props) => <ProcessForm department = {props.match.params.department} />} />
    </Switch>

  )
}
function App() {
  const dispatch = useDispatch()

  useEffect( () => {
    auth.onAuthStateChanged( async userAuth => {
      dispatch(updateAuth(userAuth))
      if (userAuth){ 
        let getUserRole = functions.httpsCallable('getUserRole')
        const data = await getUserRole()
        // console.log("The role is", data);
        const {role} =  data.data;
        console.log("The rolee is", role)
        dispatch(udpateRole(role))
      }
    });
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const result = await getData();
    console.log("The result is ", result.data());
    dispatch(fetchDataAction({...result.data(), isFetching:false}))
  }

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
