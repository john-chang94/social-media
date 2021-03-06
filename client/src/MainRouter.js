import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import SignUp from './user/SignUp';
import SignIn from './user/signIn';
import Navbar from './components/Navbar';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import FindPeople from './user/FindPeople';
import ForgotPassword from './user/ForgotPassword';
import NewPost from './post/NewPost';
import PrivateRoute from './auth/PrivateRoute';
import Post from './post/Post';
import EditPost from './post/EditPost';
import ResetPassword from './user/ResetPassword';

const MainRouter = () => (
    <div>
        <Navbar />
        <Switch>
            <Route exact path='/' component={Home} />
            <PrivateRoute path='/post/create' component={NewPost} />
            <Route exact path='/post/:postId' component={Post} />
            <PrivateRoute exact path='/post/edit/:postId' component={EditPost} />
            <Route path='/users' component={Users} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/reset-password/:resetPasswordToken' component={ResetPassword} />
            <PrivateRoute exact path='/user/edit/:userId' component={EditProfile} />
            <PrivateRoute path='/findpeople' component={FindPeople} />
            <PrivateRoute exact path='/user/:userId' component={Profile} />
        </Switch>
    </div>
)

export default MainRouter;