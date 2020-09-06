import React, { Component } from 'react';
import { isAuthenticated, signOut } from '../auth';
import { remove } from './apiUser';

class DeleteUser extends Component {
    deleteAccount = () => {
        const token = isAuthenticated().token;
        remove(this.props.userId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                signOut();
                this.props.setRedirectToSignIn(true);
            }
        })
    }

    deleteConfirm = () => {
        let answer = window.confirm('Are you sure you want to delete your account?');
        if (answer) {
            this.deleteAccount()
        }
    }

    render() {
        return (
            <button className="btn btn-raised btn-danger" onClick={this.deleteConfirm}>
                Delete Profile
            </button>
        )
    }
}

export default DeleteUser;