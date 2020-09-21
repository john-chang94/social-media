import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowUserButton extends Component {
    render() {
        const { handleFollow, isFollowing } = this.props;
        return (
            <div className="d-inline-block mt-1">
                {
                    !isFollowing ?
                        <button className="btn btn-success btn-raised mr-3" onClick={() => handleFollow(follow)}>
                            Follow
                        </button> :
                        <button className="btn btn-warning btn-raised" onClick={() => handleFollow(unfollow)}>
                            Unfollow
                        </button>
                }
            </div>
        );
    }
}

export default FollowUserButton;