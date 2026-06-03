var createError = require('http-errors');
var express = require('express');

var dotenv = require('dotenv');
dotenv.config();

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var session = require('express-session');
const MemoryStore = require('session-memory-store')(session);

var flash = require('express-flash');

var mbgRouter = require('./routes/mbg');
var kipkRouter = require('./routes/kipk');
var kategoriRouter = require('./routes/kategori');
var biodataRouter = require('./routes/biodata');
var produkRouter = require('./routes/produk');
var mahasiswaRouter = require('./routes/mahasiswa');


var apiKategoriRouter = require('./routes/api/kategori');
var apiProdukRouter = require('./routes/api/produk');

const cors = require('cors');

var registerRouter = require('./routes/auth/register');
var loginRouter = require('./routes/auth/login');
const { onlyDomain } = require('./config/middleware/corsOptions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
//const{onlyDomain} = require('./config/middleware/corsOptions');

app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'public/images')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: {
    maxAge: 60000000000,
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
  },
  store: new MemoryStore(),
  saveUninitialized: true,
  resave: true,
  secret: 'secret'
}))
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mbg', mbgRouter);
app.use('/kipk', kipkRouter);
app.use('/kategori', kategoriRouter);
app.use('/biodata',biodataRouter);
app.use('/produk',produkRouter);
app.use('/mahasiswa',mahasiswaRouter);

app.use('/api/kategori', apiKategoriRouter);
app.use('/api/produk', require('./routes/api/produk'));

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
