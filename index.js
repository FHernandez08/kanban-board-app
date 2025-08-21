const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json);
app.set('view engine' , 'ejs');

// middleware incorporated


// routes
app.get("/", (req, res) => {
    res.render("index");
});



app.listen(PORT, () => {
    console.log(`The app is listening on port ${PORT}!`);
    console.log(`To access the website, go to http://localhost:${PORT}`);
})