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
    return (
        <div>
            <h2 className="mt-5 mb-5">Profile</h2>
            <div className="row">
                <div className="col-md-6">
                    <img className="card-img-top" src={DefaultProfile} alt={user.name} style={{ width: '100%', height: '15vw', objectFit: 'cover' }} />
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
        </div>
    );
}

export default withRouter(Profile);