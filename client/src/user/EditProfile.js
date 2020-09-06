import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read } from './apiUser';

class EditProfile extends Component {
    state = {
        id: '',
        name: '',
        email: '',
        password: ''
    }

    componentDidMount() {
        // props comes from Link
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    // Get user info
    init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
            .then(data => {
                if (data.error) {
                    console.log('Error')
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email
                    })
                }
            })
    }

    handleChange = (name) => e => {
        this.setState({
            [name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password } = this.state;
        const user = { name, email, password };

        console.log(user)
        // signUp(user)
        //     .then(data => {
        //         if (data.error) {
        //             this.setState({
        //                 error: data.error
        //             })
        //         } else {
        //             this.setState({
        //                 error: '',
        //                 name: '',
        //                 email: '',
        //                 password: '',
        //                 success: true
        //             })
        //         }
        //     })
    }

    renderSignUp = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text"
                    value={name}
                    onChange={this.handleChange('name')}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email"
                    value={email}
                    onChange={this.handleChange('email')}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password"
                    value={password}
                    onChange={this.handleChange('password')}
                    className="form-control"
                />
            </div>
            <button onClick={this.handleSubmit} className="btn btn-raised btn-primary">Update</button>
        </form>
    )

    render() {
        const { name, email, password } = this.state;
        return (
            <div>
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                {this.renderSignUp(name, email)}
            </div>
        );
    }
}

export default EditProfile;