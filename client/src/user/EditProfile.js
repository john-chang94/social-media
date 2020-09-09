import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class EditProfile extends Component {
    state = {
        id: '',
        name: '',
        email: '',
        about: '',
        password: '',
        fileSize: 0,
        redirectToProfile: false,
        error: '',
        loading: false
    }

    componentDidMount() {
        // FormData is built in
        this.userData = new FormData()
        // props comes from Link
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state;
        if (fileSize > 300000) {
            this.setState({ error: 'File size must less than 3mb' })
            return false;
        }
        if (name.length === 0) {
            this.setState({
                error: 'Name is required',
                loading: false
            })
            return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            this.setState({
                error: 'Valid email is required',
                loading: false
            })
            return false;
        }
        // If user input is at least one character (in process of editing), then validate input
        if (password.length >= 1 && password.length <= 7) {
            this.setState({ error: 'Password must be at least 8 characters',
            loading: false    
        })
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
                        about: data.about,
                        error: ''
                    })
                }
            })
    }

    handleChange = (name) => e => {
        this.setState({ error: '' })
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = name === 'photo' ? e.target.files[0].size : 0;
        this.userData.set(name, value) // name: key, value: value
        this.setState({
            [name]: value,
            fileSize
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true })

        if (this.isValid()) {
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
                        updateUser(data, () => {
                            this.setState({
                                redirectToProfile: true
                            })
                        })
                    }
                })
        }
    }

    renderEditProfile = (name, email, password, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Picture</label>
                <input type="file"
                    accept="image/*"
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
                <label className="text-muted">About</label>
                <textarea
                    value={about}
                    onChange={this.handleChange('about')}
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
        const { id, name, email, password, about, redirectToProfile, error, loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }
        // Grab photo using URL set up in backend, otherwise use default image
        // Query new Date and get Time to refresh newly uploaded image
        const photoURL = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile
        return (
            <div>
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                {
                    error ?
                        <div className="alert alert-danger mt-2">{error}</div>
                        : null
                }
                {
                    loading ?
                        <div className="jumbotron text-center">
                            <h2>Loading...</h2>
                        </div>
                        : null
                }

                <img src={photoURL}
                    alt={name}
                    style={{ height: '200px', width: 'auto' }}
                    className="img-thumbnail"
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                />

                {this.renderEditProfile(name, email, password, about)}
            </div>
        );
    }
}

export default EditProfile;