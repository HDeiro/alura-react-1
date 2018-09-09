import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import AuthorBox from './components/AuthorComponent/AuthorComponent';
import Home from './Home';
//import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import BookBox from './components/BookComponent/BookComponent';

let routes = (
    <Router>
        <App>
            <Switch>            
                <Route exact path="/" component={Home}/>
                <Route path="/autor" component={AuthorBox}/>
                <Route path="/livro" component={BookBox}/>
            </Switch>            
        </App>
    </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
 