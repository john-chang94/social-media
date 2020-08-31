import React, { useState, useEffect } from 'react'
import { isAuthenticated } from '../auth';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.png';

const Profile = (props) => {
    const [user, setUser] = useState('');
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);
    const [userID, setUserId] = useState(props.match.params.userId);

    const init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
            .then(data => {
                if (data.error) {
                    console.log('Error')
                } else {
                    setUser(data)
                }
            })
    }

    useEffect(() => {
        // Set userID state to own profile userId grabbed from URL
        // so the useEffect below can run and refresh the user data
        setUserId(props.match.params.userId)
    })

    useEffect(() => {
        const userId = props.match.params.userId;
        init(userId);
    }, [userID])

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
                        isAuthenticated().user._id == user._id && (
                            <div className="d-inline-block">
                                <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                    Edit Profile
                                </Link>
                                <button className="btn btn-raised btn-danger">Delete Profile</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default withRouter(Profile);