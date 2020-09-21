import React, { Component } from 'react'
import { findPeople, follow } from './apiUser';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../images/avatar.png';
import { Link, Redirect } from 'react-router-dom';

class FindPeople extends Component {
    state = {
        users: [],
        error: '',
        showMessage: false,
        followMessage: ''
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    }

    handleFollow = (user, index) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        follow(userId, token, user._id)
        .then(data => {
            if (data.error) {
                this.setState({ error: data.error })
            } else {
                let toFollow = this.state.users;
                // Whichever user that has just been followed,
                // splice out that user from the state 
                toFollow.splice(index, 1);
                this.setState({
                    users: toFollow,
                    showMessage: true,
                    followMessage: `Following ${user.name}`
                })
            }
        })
    }

    renderUsers = users => {
        return (
            <div className="row">
                {users && users.map((user, index) => (
                    <div className="card col-md-4" key={index}>
                        <img src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                            alt={user.name}
                            style={{ height: '200px', width: 'auto' }}
                            className="img-thumbnail"
                            onError={i => (i.target.src = `${DefaultProfile}`)} // Display default image if no photo
                        />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>
                            <Link to={`/user/${user._id}`} className="btn btn-raised btn-sm btn-primary">View Profile</Link>

                            <button className="btn btn-raised btn-info float-right btn-sm" onClick={() => this.handleFollow(user, index)}>Follow</button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    render() {
        const { users, open, followMessage } = this.state;
        const token = isAuthenticated().token;
        if (!token) {
            return <Redirect to='/signin' />
        }
        return (
            <div>
                <h2 className="mt-5 mb-5">Find People</h2>
                <div>
                    {
                        open && <p className="alert alert-success">{followMessage}</p>
                    }
                </div>
                {this.renderUsers(users)}
            </div>
        );
    }
}

export default FindPeople;