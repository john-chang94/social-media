import React, { useState, useEffect } from 'react'
import { isAuthenticated } from '../auth';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser';
import FollowUserButton from './FollowUserButton';

const Profile = (props) => {
    const [user, setUser] = useState('');
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [error, setError] = useState('');

    // Get user info
    const init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
            .then(async data => {
                if (data.error) {
                    // If user is not authenticated, send to sign in page
                    setRedirectToSignIn(true);
                } else {
                    // Pass the user data to check profile followers list
                    let following = await checkFollow(data);
                    setIsFollowing(following);
                    // Set user info in state
                    setUser(data)
                }
            })
    }

    const handleFollow = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        // (Signed-in user, auth token, user profile - in state)
        callApi(userId, token, user._id)
            .then(async data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data);
                    let following = await checkFollow(data);
                    setIsFollowing(following);
                }
            })
    }

    const checkFollow = nUser => {
        const jwt = isAuthenticated();
        // console.log(jwt)
        const match = nUser.followers.find(follower => {
            // Check if the signed-in user is following the fetched user's followers list
            return follower._id === jwt.user._id
        })
        return match;
    }

    useEffect(() => {
        const userId = props.match.params.userId;
        init(userId);
        // Take effect when the ID in URL is changed
    }, [props.match.params.userId])

    if (redirectToSignIn || !isAuthenticated().token) return <Redirect to='/signin' />
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
                            isAuthenticated().user._id === user._id ? (
                                <div className="d-inline-block">
                                    <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                        Edit Profile
                                </Link>
                                    <DeleteUser userId={user._id} setRedirectToSignIn={setRedirectToSignIn} />
                                </div>
                            ) :
                            <FollowUserButton isFollowing={isFollowing}
                                handleFollow={handleFollow}
                            />
                    }
                </div>
            </div>
            <div className="row">
                <div className="col md-12 mt-4 mb-5">
                    <hr />
                    <p className="lead">{user.about}</p>
                    <hr />
                </div>
            </div>
        </div>
    );
}

export default withRouter(Profile);