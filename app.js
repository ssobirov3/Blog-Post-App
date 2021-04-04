const express = require('express');
const { render } = require('pug');
const app = express()
const fs = require('fs');
const { notStrictEqual } = require('assert');



app.set('view engine', 'pug');

app.use('/static', express.static('public'));
app.use(express.urlencoded({ extended: false }))

// localhost:8000
app.get('/', (req, res) => {
    res.render('home');
})


app.get('/create', (req, res) => {

    res.render('create');
})


app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if (title.trim() === '' && description.trim() === '') {
        res.render('create', { err: true })
    } else {
        fs.readFile('./data/posts.json', (err, data) => {
            if (err) throw err

            const posts = JSON.parse(data)

            posts.push({
                id: id(),
                title: title,
                description: description,
            })

            fs.writeFile('./data/posts.json', JSON.stringify(posts), err => {
                if (err) throw err

                res.render('create', { success: true })

            })
        })
    }

})


app.get('/api/v1/posts', (req, res) => {
    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        res.json(posts)
    })
})

app.get('/posts', (req, res) => {
    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        res.render('posts', { posts: posts })
    })

})

app.get('/posts/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        const post = posts.filter(post => post.id === id)[0]

        res.render('detail', { post: post })
    })


})

app.listen(8000, (err) => {
    if (err) console.log(err);

    console.log('Server is running on the port 8000');
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}