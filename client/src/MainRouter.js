import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import SignUp from './user/SignUp';
import SignIn from './user/signIn';
import Navbar from './components/Navbar';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';

const MainRouter = () => (
    <div>
        <Navbar />
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/users' component={Users} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <PrivateRoute path='/user/edit/:userId' component={EditProfile} />
            <PrivateRoute path='/user/:userId' component={Profile} />
        </Switch>
    </div>
)

export default MainRouter;