import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import places from './config/places.json';
import Page from './components/Page';

export default function Routes() {
    return (
        <Router>
            <Switch>
                {
                    places.map(place => (
                        <Route component={Page} path={`/${place.code}`} exact/>
                    ))
                }
                <Route>
                    <Redirect to={`/${places[0].code}`} />
                </Route>
            </Switch>
        </Router>
    )
}