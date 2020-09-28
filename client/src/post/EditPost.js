import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { loadPost, updatePost } from './apiPost';
import DefaultPost from '../images/puzzle.jpg';

class EditPost extends Component {
    state = {
        id: '',
        title: '',
        body: '',
        fileSize: 0,
        redirectToProfile: false,
        loading: false,
        error: ''
    }

    componentDidMount() {
        // FormData is built in
        this.postData = new FormData();
        // props comes from Link
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    // Get user info
    init = postId => {
        loadPost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        error: ''
                    })
                }
            })
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
            const postId = this.state.id;
            const token = isAuthenticated().token;

            // userData will contain all the user info
            updatePost(postId, token, this.postData)
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
                            redirectToProfile: true
                        })
                    }
                })
        }
    }

    renderEditPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Picture</label>
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
            <button onClick={this.handleSubmit} className="btn btn-raised btn-primary">Save Changes</button>
        </form>
    )

    render() {
        const { id, title, body, loading, error } = this.state;
        if (this.state.redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }
        return (
            <div>
                <h2 className="mt-4 mb-4">{title}</h2>

                {
                    error
                        ? <div className="alert alert-danger mt-2">{error}</div>
                        : null
                }
                {
                    loading
                        ? <div className="jumbotron text-center">
                            <h2>Loading...</h2>
                        </div>
                        : null
                }

                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${id}}`}
                    alt={title}
                    style={{ height: '200px', width: 'auto' }}
                    className="img-thumbnail"
                    onError={i => (i.target.src = `${DefaultPost}`)}
                />
                {
                    this.renderEditPostForm(title, body)
                }
            </div>
        );
    }
}

export default EditPost;