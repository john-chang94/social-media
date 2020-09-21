import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class ProfileTabs extends Component {
    render() { 
        const { followers, following } = this.props;
        return ( 
            <div className="row">
                <div className="col-md-4">
                    <h3 className="text-primary">Followers</h3>
                    <hr/>
                    {
                        followers.map((follower, index) => (
                            <div key={index}>
                                <Link to={`/user/${follower._id}`}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${follower._id}`}
                                        className="float-left mr-2"
                                        style={{ borderRadius: '50%', border: '1px solid black' }}
                                        height="30px"
                                        width="30px"
                                        alt={follower.name}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                    <p className="lead">{follower.name}</p>
                                </Link>
                            </div>
                        ))
                    }
                </div>

                <div className="col-md-4">
                    <h3 className="text-primary">Following</h3>
                    <hr/>
                    {
                        following.map((followee, index) => (
                            <div key={index}>
                                <Link to={`/user/${followee._id}`}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${followee._id}`}
                                        className="float-left mr-2"
                                        style={{ borderRadius: '50%', border: '1px solid black' }}
                                        height="30px"
                                        width="30px"
                                        alt={followee.name}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                    <p className="lead">{followee.name}</p>
                                </Link>
                            </div>
                        ))
                    }
                </div>

                <div className="col-md-4">
                    <h3 className="text-primary">Posts</h3>
                    <hr/>
                    {
                        following.map((post, index) => (
                            <div key={index}>
                                <Link to={`/user/${post._id}`}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${post._id}`}
                                        className="float-left mr-2"
                                        height="30px"
                                        alt={post.name}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                    <p className="lead">{post.name}</p>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
         );
    }
}
 
export default ProfileTabs;