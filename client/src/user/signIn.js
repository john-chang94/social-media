import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signIn, authenticate } from '../auth';

class SignIn extends Component {
    state = {
        email: '',
        password: '',
        error: '',
        redirect: false,
        loading: false
    }

    handleChange = (name) => e => {
        this.setState({ error: '' })
        this.setState({
            [name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true })
        const { email, password } = this.state;
        const user = { email, password };

        signIn(user)
            .then(data => {
                if (data.error) {
                    this.setState({
                        error: data.error,
                        loading: false
                    })
                } else {
                    authenticate(data, () => {
                        this.setState({ redirect: true })
                    })
                }
            })
    }

    renderSignIn = (email, password) => (
        <form>
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
            <button onClick={this.handleSubmit} className="btn btn-raised btn-primary">Submit</button>
        </form>
    )

    render() {
        const { email, password, error, redirect, loading } = this.state;
        if (redirect) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <h2 className="mt-5 mb-5">Sign In</h2>
                {this.renderSignIn(email, password)}
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
            </div>
        );
    }
}

export default SignIn;