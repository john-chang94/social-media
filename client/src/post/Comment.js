import React, { Component } from 'react';
import { addComment, removeComment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class Comment extends Component {
    state = {
        text: '',
        error: ''
    }

    handleChange = e => {
        this.setState({ error: '' })
        this.setState({
            text: e.target.value
        })
    }

    isValid = () => {
        const { text } = this.state;
        if (text.length < 1 || text.length > 150) {
            this.setState({
                error: 'Comment must be between 1-150 characters'
            })
            return false;
        }
        return true;
    }

    handleSubmit = e => {
        e.preventDefault();

        if (!isAuthenticated()) {
            this.setState({
                error: 'Sign in to leave a comment'
            })
            return;
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const comment = { text: this.state.text };

            addComment(userId, token, postId, comment)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ text: '' });
                        this.props.updateComments(data.comments);
                    }
                })
        }
    }

    deleteComment = (comment) => {
        let answer = window.confirm('Are you sure you want to delete your comment?');

        if (answer) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            removeComment(userId, token, postId, comment)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.props.updateComments(data.comments);
                    }
                })
        }
    }

    render() {
        const { comments } = this.props;
        const { error } = this.state;
        return (
            <div>
                <h2 className="mt-4 mb-3">Leave a comment</h2>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control mb-3" value={this.state.text} onChange={this.handleChange} placeholder='Leave a comment...' />
                        <button className="btn btn-raised btn-success mt-2">Post</button>
                    </div>
                </form>

                <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                    {error}
                </div>

                <div className="col-md-12 col-md-offset-2 mb-5">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    {
                        comments.reverse().map((comment, index) => (
                            <div key={index}>
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                        className="float-left mr-2"
                                        style={{ borderRadius: '50%', border: '1px solid black' }}
                                        height="30px"
                                        width="30px"
                                        alt={comment.postedBy.name}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                </Link>
                                <p className="lead">{comment.text}</p>
                                <p className="font-italic mark">
                                    Posted by <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name}</Link> on {new Date(comment.createdAt).toDateString()}

                                    <span>
                                        {
                                            // Show edit and delete buttons to signed-in user only
                                            isAuthenticated().user &&
                                            isAuthenticated().user._id === comment.postedBy._id &&
                                            <>
                                                <span className="text-danger float-right mr-1" style={{ cursor: 'pointer' }} onClick={this.deleteComment.bind(this, comment)}>Delete</span>
                                            </>
                                        }
                                    </span>
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Comment;