var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// Logging Morgan
var logger = require('morgan');

var session = require('express-session');
const MemoryStore = require('session-memory-store')(session);
var flash = require('express-flash');
const cors = require('cors');

var dotenv = require('dotenv');
dotenv.config();

const compression = require('compression');
// Contoh menggunakan compression level 1 atau 9


// Import Router Web (EJS)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mbgRouter = require('./routes/mbg');
var kipkRouter = require('./routes/kipk');
var kategoriRouter = require('./routes/kategori');
var biodataRouter = require('./routes/biodata');
var produkRouter = require('./routes/produk');
var mahasiswaRouter = require('./routes/mahasiswa');

// Import Router APIvvar apiKategoriRouter = require('./routes/api/kategori');
var apiProdukRouter = require('./routes/api/produk');
var registerRouter = require('./routes/auth/register');
var loginRouter = require('./routes/auth/login');
var apiKategoriRouter = require('./routes/api/kategori');
var loginRouter = require('./routes/auth/login'); // Sesuaikan path file router login Anda
var app = express();
app.use(compression({ level: 1 }))

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware Configuration
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public/images')));

// Menggunakan Morgan format dev
app.use(logger('dev'));
app.use('/auth', loginRouter); 
// atau app.use('/api/login', loginRouter); tergantung struktur file Anda

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
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
}));
app.use(flash());

// Web Routes (Views)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mbg', mbgRouter);
app.use('/kipk', kipkRouter);
app.use('/kategori', kategoriRouter);
app.use('/biodata', biodataRouter);
app.use('/produk', produkRouter);
app.use('/mahasiswa', mahasiswaRouter);

// API Routes
app.use('/api/kategori', apiKategoriRouter);
app.use('/api/produk', apiProdukRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);


// Catch 404 and Forward to Error Handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;