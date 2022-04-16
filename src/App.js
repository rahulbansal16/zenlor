import { Layout } from 'antd';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.less';
import Authorization from "./auth/Authorization";
import Logout from "./auth/Logout";
import Action from "./components/Action";
import AddNewForm from './components/AddNewForm';
import Login from "./container/Login";
import { auth, functions } from "./firebase";
import Department from "./forms/dataEntry/Department";
import EditForm from "./forms/EditForm";
import FormLoader from './forms/FormLoader';
import Home from "./forms/Home";
import ProcessForm from './forms/ProcessForm';
import { fetchDataAction, udpateRole, updateAuth } from "./redux/actions";
import SideBar from "./SideBar";
const { Header, Footer, Sider, Content } = Layout;

const RenderPages = () => {
  const history = useHistory()
  return (
    <Switch>
      <Route exact path = "/" render={() => history.push({
        pathname:`/action/dashboard`
      })} />
      <Route exact path="/factory/" render = { () => <Department/>} />
      <Route exact path="/action/:type/new" render = { (props) => 
        <Layout>
          <SideBar></SideBar>
          <AddNewForm/>
        </Layout>
      } />
      <Route exact path="/action/:type" render = { (props) => 
        <Layout hasSider={true} style={{
          // fontSize:"13px",
          overflowX: 'scroll',
          overflowY: "clip"
        }}>
          <SideBar type={props.match.params.type}></SideBar>
          <Content>
            <Action type={props.match.params.type}/>
          </Content>
        </Layout>
      } />
      <Route exact path="/logout" render = { () => <Logout/>} /> 
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
    let getData = functions.httpsCallable('getData')
    const result = await getData(companyId);
    console.log("The result is ", result.data);
    dispatch(fetchDataAction({...result.data, isFetching:false}))
  }

  return (
    <div className="App" 
    // style={{overflowY:'hidden'}}
    >
      <Router>
        <RenderPages/>
      </Router>
    </div>
  );
}

export default App;
