import './App.less';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import StyleCodeEditor from './components/StyleCodeEditor';

const renderPages = () => {
  return (
    <Switch>
      <Route exact path = "/" render = { () => <Home></Home>} />
      <Route exact path = "/stylecode" render = { () => <StyleCodeEditor/>} />
    </Switch>

  )
}
function App() {
  return (
    <div className="App">
      <Router>
        {renderPages()}
      </Router>
    </div>
  );
}

export default App;
