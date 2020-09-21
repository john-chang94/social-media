import React, { Component } from 'react'
import { loadPost } from './apiPost';
import DefaultPost from '../images/puzzle.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';

class Post extends Component {
    state = {
        post: ''
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        loadPost(postId)
            .then(data => {
                if (data.erro) {
                    console.log(data.error)
                } else {
                    this.setState({ post: data })
                }
            })
    }

    renderPost = post => {
        // We have return twice with curly brackets so we can set the consts before the actual render
        const posterId = post.postedBy
            // Set Link to the user profile,
            // otherwise set an empty Link if unknown poster
            ? `/user/${post.postedBy._id}`
            : ''
        const posterName = post.postedBy
            ? post.postedBy.name
            : ' Unknown'
        return (
            <div className="card-body">
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i => i.target.src = `${DefaultPost}`}
                    className="img-thumbnail mb-3"
                    style={{ width: '100%' }}
                />
                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName}</Link> on {new Date(post.createdAt).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to='/' className="btn btn-raised btn-primary mr-5">Home</Link>
                    {
                        // Show edit and delete buttons to signed-in user only
                        isAuthenticated().user &&
                        isAuthenticated().user._id === post.postedBy._id &&
                        <>
                            <button className="btn btn-raised btn-warning mr-5">Edit</button>
                            <button className="btn btn-raised btn-danger">Delete</button>
                        </>
                    }
                </div>
            </div>
        )
    }

    render() {
        const { post } = this.state;
        return (
            <div>
                <h2 className="display-2 mt-3">{post.title}</h2>
                {
                    !post
                        ? <div className="jumbotron text-center">
                            <h2>Loading...</h2>
                        </div>
                        : this.renderPost(post)
                }
            </div>
        );
    }
}

export default Post;