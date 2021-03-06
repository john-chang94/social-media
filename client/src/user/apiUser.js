export const read = (userId, token) => {
    // Without return, the .then in the init method will not work
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'GET'
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const update = (userId, token, user) => {
    // Without return, the .then in the init method will not work
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: user // No need for JSON.stringify because the formData that will be passed is already parsed
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

// Update user info in local storage
export const updateUser = (user, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('token')) {
            let auth = JSON.parse(localStorage.getItem('token'));
            auth.user = user // Assign updated user
            localStorage.setItem('token', JSON.stringify(auth));
            
            next();
        }
    }
}

export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const follow = (userId, token, followId) => {
    // Without return, the .then in the init method will not work
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, followId })
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const unfollow = (userId, token, unfollowId) => {
    // Without return, the .then in the init method will not work
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, unfollowId })
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const findPeople = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}