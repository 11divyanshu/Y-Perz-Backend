const express = require('express')
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const port = 3000
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/Images', express.static('./Images'));
app.get('/', (req, res) => {
  res.render('admin/login', {
    pageTitle: 'Login Page | Y PEREZ',
    path: '/admin/login',
    confirmation: '204'
  });
});

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// handeling 404 error page 
// app.use(errorController.get404);

// sequelize.sync().then((result) => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
// }).catch(err => {
//   console.log(err);
// })

