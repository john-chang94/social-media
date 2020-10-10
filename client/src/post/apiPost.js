export const createPost = (userId, token, post) => {
    // Without return, the .then in the init method will not work
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: post // No need for JSON.stringify because the formData that will be passed is already parsed
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const getPosts = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: 'GET'
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const loadPost = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: 'GET'
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const getPostsByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
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

export const updatePost = (postId, token, post) => {
    // Without return, the .then in the init method will not work
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: post // No need for JSON.stringify because the formData that will be passed is already parsed
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const removePost = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
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

export const likePost = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const unlikePost = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const addComment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}

export const removeComment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err)
    })
}