import { Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.less';
import Authorization from "./auth/Authorization";
import Logout from "./auth/Logout";
import Header from './components/Header';
import Loader from "./components/Loader";
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
      <Route exact path="/:department/form/edit">
        { (props) => <Authorization allowedRoles={["admin", "manager"]} department = {props.match.params.department}> 
            <EditForm department = {props.match.params.department} />
          </Authorization>
        } 
      </Route>
      <Route exact path="/:department/form">
        { (props) => <Authorization allowedRoles={["admin", "manager"]} department = {props.match.params.department}> 
        <FormLoader department = {props.match.params.department} />
          </Authorization>
        } 
      </Route>
      <Route exact path="/:department/process/form">
        { (props) => <Authorization allowedRoles={["admin", "manager"]} department = {props.match.params.department}> 
          <ProcessForm department = {props.match.params.department} />
          </Authorization>
        }         
      </Route>
    </Switch>

  )
}
function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.taskReducer.user)
  const isFetching = useSelector( state => state.taskReducer.isFetching)
  const history = useHistory()

  
  useEffect( () => {
    auth.onAuthStateChanged( async userAuth => {
      dispatch(updateAuth(userAuth))
      if (userAuth){ 
        let getUserRole = functions.httpsCallable('getUserRole')
        const data = await getUserRole()
        const {role, company} =  data.data;
        fetchData(company)
        dispatch(udpateRole(role, company))
      }
    });
  }, [dispatch])

  useEffect(() => {
    // fetchData()
  }, [])

  const fetchData = async (companyId) => {
    const result = await getData(companyId);
    console.log("The result is ", result.data());
    dispatch(fetchDataAction({...result.data(), isFetching:false}))
  }

  if (!user)
  return <div>
      <div>Please Login To continue</div>
      <Button 
      type="primary"
      size="large"
      onClick = { () => history.push("/login")}>Login</Button>
  </div>

  if (isFetching){
      return <Loader/>
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
