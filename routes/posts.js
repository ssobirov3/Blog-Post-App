const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const rootFolder = path.dirname(
    require.main.filename || process.require.main.filename
);

const db = `${rootFolder}/data/posts.json`

router.get('/', (req, res) => {
    fs.readFile(db, (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data).filter(post => post.archived != true)

        res.render('posts', { posts: posts, heading: "All the Posts" })
    })

})

router.get('/:id', (req, res) => {
    const id = req.params.id
    fs.readFile(db, (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        const post = posts.filter(post => post.id === id)[0]

        res.render('detail', { post: post })
    })


})

router.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile(db, (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        const filteredPosts = posts.filter(post => post.id !== id)

        console.log(filteredPosts)
        fs.writeFile(db, JSON.stringify(filteredPosts), err => {
            if (err) throw err


            res.render('posts', { id: id, posts: filteredPosts, deleted: true, heading: "All the Posts" })
        })
    })
})


router.get('/:id/archive', (req, res) => {
    const id = req.params.id

    fs.readFile(db, (err, data) => {
        const posts = JSON.parse(data)

        const post = posts.filter(post => post.id == id)[0]
        const postId = posts.indexOf(post)
        const splicedPost = posts.splice(postId, 1)[0]
        splicedPost.archived = true
        posts.push(splicedPost)

        fs.writeFile(db, JSON.stringify(posts), (err) => {
            if (err) throw err

            res.redirect('/posts')
        })

    })
})



module.exports = router