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

export const fetchPosts = () => {
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