import React, { Component } from 'react'
import { list } from './apiUser';
import DefaultProfile from '../images/avatar.png';
import { Link } from 'react-router-dom';

class Users extends Component {
    state = {
        users: []
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
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
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <h2 className="mt-5 mb-5">Users</h2>
                {this.renderUsers(users)}
            </div>
        );
    }
}

export default Users;