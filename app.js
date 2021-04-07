const express = require('express');
const app = express()
const fs = require('fs');
const db = './data/posts.json'
const posts = require('./routes/posts.js')

app.set('view engine', 'pug');

app.use('/static', express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use('/posts', posts)

// localhost:8000
app.get('/', (req, res) => {
    res.render('home');
})


app.get('/create', (req, res) => {

    res.render('create');
})


app.post('/create', (req, res) => {
    const title = req.body.title
    const snippet = req.body.snippet
    const description = req.body.description


    if (title.trim() === '' || description.trim() === '' || snippet.trim() === '') {
        res.render('create', { err: true })
    } else {
        fs.readFile(db, (err, data) => {
            if (err) throw err

            const posts = JSON.parse(data)

            posts.push({
                id: id(),
                title: title,
                snippet: snippet,
                description: description
            })

            fs.writeFile(db, JSON.stringify(posts), err => {
                if (err) throw err

                res.render('create', { success: true })

            })
        })
    }

})


app.get('/api/v1/posts', (req, res) => {
    fs.readFile(db, (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        res.json(posts)
    })
})


app.get('/archive', (req, res) => {
    fs.readFile(db, (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data).filter(post => post.archived == true)
        res.render('posts', { title: "Hey", posts: posts, heading: "Archived Posts" });
    })
})


app.listen(8000, (err) => {
    if (err) console.log(err);

    console.log('Server is running on the port 8000');
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}