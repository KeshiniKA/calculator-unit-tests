const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Database connection
const db = mysql.createConnection({

  host: 'sql.freedb.tech',
  user: 'freedb_keshini',
  password: '9kmr758B8Sp*UCW',
  database: 'freedb_moodapp'
  
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Moods routes
app.get('/moods', (req, res) => {
  db.query('SELECT * FROM Moods', (err, results) => {
    if (err) throw err;
    res.render('moods', { title: 'Moods', moods: results });
  });
});

app.get('/moods/new', (req, res) => {
  res.render('mood_form', { title: 'Add New Mood' });
});

app.post('/moods/new', (req, res) => {
  const { moodType, intensity } = req.body;
  db.query('INSERT INTO Moods (moodType, intensity, timestamp) VALUES (?, ?, NOW())', [moodType, intensity], (err) => {
    if (err) throw err;
    res.redirect('/moods');
  });
});

// Activities routes
app.get('/activities', (req, res) => {
  db.query('SELECT * FROM Activities', (err, results) => {
    if (err) throw err;
    res.render('activities', { title: 'Activities', activities: results });
  });
});

app.get('/activities/new', (req, res) => {
  res.render('activity_form', { title: 'Add New Activity' });
});

app.post('/activities/new', (req, res) => {
  const { mood_id, description } = req.body;
  db.query('INSERT INTO Activities (mood_id, description, timestamp) VALUES (?, ?, NOW())', [mood_id, description], (err) => {
    if (err) throw err;
    res.redirect('/activities');
  });
});

// Community posts routes
app.get('/community', (req, res) => {
  db.query('SELECT * FROM CommunityPosts', (err, results) => {
    if (err) throw err;
    res.render('community', { title: 'Community', posts: results });
  });
});

app.get('/community/new', (req, res) => {
  res.render('post_form', { title: 'Add New Post' });
});

app.post('/community/new', (req, res) => {
  const { userID, content } = req.body;
  db.query('INSERT INTO CommunityPosts (userID, content, postDate) VALUES (?, ?, NOW())', [userID, content], (err) => {
    if (err) throw err;
    res.redirect('/community');
  });
});

// Comments routes
app.get('/community/:postID', (req, res) => {
  const postID = req.params.postID;
  db.query('SELECT * FROM Comments WHERE postID = ?', [postID], (err, results) => {
    if (err) ;
    res.render('comments', { title: 'Comments', comments: results, postID: postID });
  });
});

app.post('/comments/new/:postID', (req, res) => {
  const postID = req.params.postID;
  const { userID, commentText } = req.body;
  db.query('INSERT INTO Comments (postID, userID, commentText, commentDate) VALUES (?, ?, ?, NOW())', [postID, userID, commentText], (err) => {
    if (err);
    res.redirect('/community/' + postID);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
