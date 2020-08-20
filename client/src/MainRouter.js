import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import SignUp from './user/SignUp';
import SignIn from './user/signIn';
import Navbar from './components/Navbar';

const MainRouter = () => (
    <div>
        <Navbar />
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
        </Switch>
    </div>
)

export default MainRouter;