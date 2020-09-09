import React, { useState, useEffect } from 'react'
import { isAuthenticated } from '../auth';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser';

const Profile = (props) => {
    const [user, setUser] = useState('');
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);

    // Get user info
    const init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
            .then(data => {
                if (data.error) {
                    setRedirectToSignIn(true);
                } else {
                    // Set user info into state
                    setUser(data)
                }
            })
    }

    useEffect(() => {
        const userId = props.match.params.userId;
        init(userId);
        // Take effect when the ID in URL is changed
        // We place the dependency in an array because syntax
    }, [props.match.params.userId])

    if (redirectToSignIn) return <Redirect to='/signin' />
    // Grab photo using URL set up in backend, otherwise use default image
    // Query new Date and get Time to refresh newly uploaded image
    const photoURL = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile
    return (
        <div>
            <h2 className="mt-5 mb-5">Profile</h2>
            <div className="row">
                <div className="col-md-6">
                    <img src={photoURL}
                        alt={user.name}
                        style={{ height: '200px', width: 'auto' }}
                        className="img-thumbnail"
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                    />
                </div>
                <div className="col-md-6">
                    <div className="lead mt-2">
                        <p>Hello, {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Joined {new Date(user.createdAt).toDateString()}</p>
                    </div>

                    {   // Show edit and delete buttons only to signed in user
                        isAuthenticated().user &&
                        isAuthenticated().user._id === user._id && (
                            <div className="d-inline-block">
                                <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} setRedirectToSignIn={setRedirectToSignIn} />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="row">
                <div className="col md-12 mt-4 mb-5">
                    <hr/>
                    <p className="lead">{user.about}</p>
                    <hr/>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Profile);