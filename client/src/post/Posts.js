import React, { Component } from 'react'
import { getPosts } from './apiPost';
import { isAuthenticated } from '../auth';
import DefaultPost from '../images/puzzle.jpg';
import { Link, Redirect } from 'react-router-dom';

class Posts extends Component {
    state = {
        posts: []
    }

    componentDidMount() {
        getPosts().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ posts: data })
            }
        })
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts && posts.map((post, index) => {
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
                        <div className="card col-md-4" key={index}>
                            <div className="card-body">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i => i.target.src = `${DefaultPost}`}
                                    className="img-thumbnail mb-3"
                                    style={{ height: '200px' }}
                                />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body.length > 45 ? `${post.body.substring(0, 45)}...` : post.body}</p>
                                <br />
                                <p className="font-italic mark">
                                    Posted by <Link to={`${posterId}`}>{posterName}</Link> on {new Date(post.createdAt).toDateString()}
                                </p>
                                <Link to={`/post/${post._id}`} className="btn btn-raised btn-sm btn-primary">Read more</Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        const { posts } = this.state;
        const token = isAuthenticated().token;
        if (!token) {
            return <Redirect to='/signin' />
        }
        return (
            <div>
                <h2 className="mt-5 mb-5">
                    {posts.length === 0 ? 'Loading...' : 'Recent Posts'}
                </h2>
                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;