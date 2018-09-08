import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import AuthorBox from './components/AuthorComponent/AuthorComponent';
import Home from './Home';

let routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/> {/*Default Route*/}
            <Route path="/autor" component={AuthorBox}/>
            <Route path="/livro"/>
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
