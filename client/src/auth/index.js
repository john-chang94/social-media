export const signUp = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err));
}

export const signIn = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err));
}

export const authenticate = (jwt, next) => {
    if (typeof(window !== 'undefined')) {
        localStorage.setItem('token', JSON.stringify(jwt))
        next()
    }
}

export const signOut = (next) => {
    // window will not be available if the browser is still opening or loading...
    // That means we need to make sure we have window object and it is not undefined
    // For that reason we make sure window is not undefined before using localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
    }
    // next() allows us to make callback in the onClick callback
    next();
}

export const isAuthenticated = () => {
    if (typeof window == 'undefined') {
        return false
    }

    if (localStorage.getItem('token')) {
        return JSON.parse(localStorage.getItem('token'))
    } else {
        return false
    }
}