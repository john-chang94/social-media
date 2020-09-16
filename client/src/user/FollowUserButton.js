import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowUserButton extends Component {
    render() {
        return (
            <div className="d-inline-block mt-1">
                {
                    !this.props.isFollowing ?
                        <button className="btn btn-success btn-raised mr-3" onClick={() => this.props.handleFollow(follow)}>
                            Follow
                        </button> :
                        <button className="btn btn-warning btn-raised" onClick={() => this.props.handleFollow(unfollow)}>
                            Unfollow
                        </button>
                }
            </div>
        );
    }
}

export default FollowUserButton;