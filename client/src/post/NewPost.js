import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { createPost } from './apiPost';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class NewPost extends Component {
    state = {
        title: '',
        body: '',
        photo: '',
        error: '',
        user: '',
        fileSize: 0,
        loading: false
    }

    componentDidMount() {
        // FormData is built in
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 3000000) {
            this.setState({ error: 'File size must less than 3mb' })
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({
                error: 'All fields are required',
                loading: false
            })
            return false;
        }
        return true;
    }

    handleChange = (name) => e => {
        this.setState({ error: '' })
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = name === 'photo' ? e.target.files[0].size : 0;
        this.postData.set(name, value) // name: key, value: value
        this.setState({
            [name]: value,
            fileSize
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true })

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            // userData will contain all the user info
            createPost(userId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({
                            error: data.error
                        })
                    } else {
                        this.setState({
                            loading: false,
                            title: '',
                            body: '',
                            photo: '',
                            redirectToProfile: true
                        })
                    }
                })
        }
    }

    renderNewPostForm = (title, body) => (
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
                <label className="text-muted">Title</label>
                <input type="text"
                    value={title}
                    onChange={this.handleChange('title')}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    value={body}
                    onChange={this.handleChange('body')}
                    className="form-control"
                />
            </div>
            <button onClick={this.handleSubmit} className="btn btn-raised btn-primary">Post</button>
        </form>
    )

    render() {
        const { title, body, photo, user, redirectToProfile, error, loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }
        return (
            <div>
                <h2 className="mt-5 mb-5">New Post</h2>
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

                {this.renderNewPostForm(title, body)}
            </div>
        );
    }
}

export default NewPost;