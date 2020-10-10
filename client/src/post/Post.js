import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { loadPost, removePost, likePost, unlikePost } from './apiPost';
import DefaultPost from '../images/puzzle.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Comment from './Comment';

class Post extends Component {
    state = {
        post: '',
        redirectToHome: false,
        redirectToSignIn: false,
        hasLiked: false,
        likes: 0,
        comments: []
    }

    componentDidMount() {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignIn: true })
            return;
        }
        const postId = this.props.match.params.postId;
        loadPost(postId)
            .then(data => {
                if (data.erro) {
                    console.log(data.error)
                } else {
                    this.setState({
                        post: data,
                        likes: data.likes.length,
                        hasLiked: this.checkLike(data.likes),
                        comments: data.comments
                    })
                }
            })
    }

    checkLike = (likes) => {
        const userId = isAuthenticated().user._id;
        // indexOf returns -1 if no match is found
        // Will return true if found, otherwise false
        let match = likes.indexOf(userId) !== -1
        return match;
    }

    deletePost = () => {
        let answer = window.confirm('Are you sure you want to delete this post?');

        if (answer) {
            const postId = this.props.match.params.postId;
            const token = isAuthenticated().token;
            removePost(postId, token)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ redirectToHome: true })
                    }
                })
        }
    }

    toggleLike = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignIn: true })
            return;
        }

        let callApi = this.state.hasLiked ? unlikePost : likePost;
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.state.post._id;

        callApi(userId, token, postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        hasLiked: !this.state.hasLiked,
                        likes: data.likes.length
                    })
                }
            })
    }

    updateComments = comments => {
        this.setState({ comments })
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

        const { hasLiked, likes } = this.state;
        return (
            <div className="card-body">
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i => i.target.src = `${DefaultPost}`}
                    className="img-thumbnail mb-3"
                    style={{ width: '100%' }}
                />

                {
                    hasLiked
                        ? <h3><i onClick={this.toggleLike} className="fa fa-thumbs-up text-success bg-dark" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer' }}></i> {likes} Like</h3>
                        : <h3><i onClick={this.toggleLike} className="fa fa-thumbs-up text-warning bg-dark" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer' }}></i> {likes} Like</h3>
                }
                
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
                            <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning mr-5">Edit</Link>
                            <button className="btn btn-raised btn-danger" onClick={this.deletePost}>Delete</button>
                        </>
                    }
                </div>
            </div>
        )
    }

    render() {
        const { post, redirectToHome, redirectToSignIn } = this.state;
        if (redirectToHome) {
            return <Redirect to='/' />
        }
        if (redirectToSignIn) {
            return <Redirect to='/signin' />
        }
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
                
                <Comment postId={post._id} comments={this.state.comments} updateComments={this.updateComments} />
            </div>
        );
    }
}

export default Post;