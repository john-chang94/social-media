import React, { Component } from 'react';
import { signUp } from '../auth';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    }

    handleChange = (name) => e => {
        this.setState({ error: '' })
        this.setState({
            [name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password } = this.state;
        const user = { name, email, password };

        signUp(user)
            .then(data => {
                if (data.error) {
                    this.setState({
                        error: data.error
                    })
                } else {
                    this.setState({
                        error: '',
                        name: '',
                        email: '',
                        password: '',
                        success: true
                    })
                }
            })
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
                <input type="text"
                    value={password}
                    onChange={this.handleChange('password')}
                    className="form-control"
                />
            </div>
            <button onClick={this.handleSubmit} className="btn btn-raised btn-primary">Submit</button>
        </form>
    )

    render() {
        const { name, email, password, error, success } = this.state;
        return (
            <div>
                <h2 className="mt-5 mb-5">Sign Up</h2>
                {this.renderSignUp(name, email, password)}
                {
                    error ?
                        <div className="alert alert-danger mt-2">{error}</div>
                        : null
                }
                {
                    success ?
                        <div className="alert alert-info mt-2">Sign up success! Please sign in.</div>
                        : null
                }
            </div>
        );
    }
}

export default SignUp;