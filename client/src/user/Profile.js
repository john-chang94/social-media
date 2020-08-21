import React, { Component } from 'react'
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';

class Profile extends Component {
    state = {
        user: '',
        redirectToSignIn: false
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
            .then(data => {
                if (data.error) {
                    console.log('Error')
                } else {
                    this.setState({ user: data })
                }
            })
    }

    render() {
        const { redirectToSignIn, user } = this.state;
        if (redirectToSignIn) return <Redirect to='/signin' />
        return (
            <div className="row">
                <div className="col-md-6">
                    <h2 className="mt-5 mb-5">Profile</h2>
                    <p>Hello, {isAuthenticated().user.name}</p>
                    <p>Email: {isAuthenticated().user.email}</p>
                    <p>Joined {new Date(user.createdAt).toDateString()}</p>
                </div>
                <div className="col-md-6">
                    {
                        isAuthenticated().user &&
                        <div className="d-inline-block mt-5">
                            <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                Edit Profile
                            </Link>
                            <button className="btn btn-raised btn-danger">Delete Profile</button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Profile;