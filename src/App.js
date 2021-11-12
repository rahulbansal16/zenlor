import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.less';
import Header from './components/Header';
import FormLoader from './forms/FormLoader';
import Home from "./forms/Home";
import ProcessForm from './forms/ProcessForm';

const renderPages = () => {
  return (
    <Switch>
      <Route exact path="/:department" render = { (props) => <Home department={props.match.params.department}/>}/>
      <Route exact path="/:department/form" render = { (props) => <FormLoader department = {props.match.params.department} />} />
      <Route exact path="/:department/process/form" render = { (props) => <ProcessForm department = {props.match.params.department} />} />
    </Switch>

  )
}
function App() {
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
