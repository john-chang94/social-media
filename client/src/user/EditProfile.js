import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update } from './apiUser';
import { Redirect } from 'react-router-dom';

class EditProfile extends Component {
    state = {
        id: '',
        name: '',
        email: '',
        password: '',
        redirectToProfile: false,
        error: ''
    }

    componentDidMount() {
        // FormData is built in
        this.userData = new FormData()
        // props comes from Link
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { name, email, password } = this.state;
        if (name.length === 0) {
            this.setState({ error: 'Name is required' })
            return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            this.setState({ error: 'Valid email is required' })
            return false;
        }
        // If user input is at least one character (in process of editing), then validate input
        if (password.length >= 1 && password.length <= 7) {
            this.setState({ error: 'Password must be at least 8 characters' })
            return false;
        }
        return true;
    }

    // Get user info
    init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        error: ''
                    })
                }
            })
    }

    handleChange = (name) => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        this.userData.set(name, value)
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isValid()) {
            const { name, email, password } = this.state;
            const user = {
                name,
                email,
                password: password || undefined // Does not override p/w in db if input box left empty
            };

            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            // userData will contain all the user info
            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({
                            error: data.error
                        })
                    } else {
                        this.setState({
                            redirectToProfile: true
                        })
                    }
                })
        }
    }

    renderEditProfile = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Picture</label>
                <input type="file"
                    accept="image/*"
                    value={name}
                    onChange={this.handleChange('photo')}
                    className="form-control"
                />
            </div>
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
        const { id, name, email, password, redirectToProfile, error } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }
        return (
            <div>
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                {
                    error ?
                        <div className="alert alert-danger mt-2">{error}</div>
                        : null
                }
                {this.renderEditProfile(name, email, password)}
            </div>
        );
    }
}

export default EditProfile;