import React from 'react';
import { Header } from './components/Header'
import './css/main.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as Pages from './pages'

function App() {
  return (
    <Router>
      <div className="px-6">
        <Header />
        <Switch>
          <Route exact path="/">
            
          </Route>
          <Route exact path="/login">
            <Pages.Login />  
          </Route>
          <Route path="*">
            <Pages.NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
