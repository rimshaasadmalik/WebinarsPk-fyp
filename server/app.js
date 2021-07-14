const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  morgan = require('morgan'),
  helmet = require('helmet'),
  bodyParser = require('body-parser'),
  app = express();

const authRoutes = require('./routes/authRoutes'),
  adminRoutes = require('./routes/adminRoutes'),
  organizerRoutes = require('./routes/organizerRoutes'),
  viewerRoutes = require('./routes/viewerRoutes'),
  eventRouter = require('./routes/eventRoutes'),
  streamRouter = require('./routes/streamRoutes');

const { PORT, MORGAN_FORMAT, MONGOURI } = require('./config');

mongoose.connect(MONGOURI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.once('open', () => { console.log('Database connection established!\n') });
db.on('error', (err) => { console.log(err) });

// Log configurations.
app.use(morgan(MORGAN_FORMAT, { skip: (req, res) => { return res.statusCode < 400 }, stream: process.stderr }));
app.use(morgan(MORGAN_FORMAT, { skip: (req, res) => { return res.statusCode >= 400 }, stream: process.stdout }));

// Enable all CORS requests.
app.use(cors());
app.options('*', cors());

// Helmet configurations.
app.use(helmet())

// Configure body-parser middleware.
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));

// Routes.
app.use('/api/v1', authRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', organizerRoutes);
app.use('/api/v1', viewerRoutes);
app.use('/api/v1', eventRouter);
app.use('/api/v1', streamRouter);

// Test Route.
app.get('/', (req, res) => { res.send(`server pinging...`) })

// app.get('/contact', (req, res) => {
//   res.cookie("test", "rimsha");
//   res.send(`hello contact page`);
// })

// app.get('/about', middleware, (req, res) => {
//   res.cookie("test", "rimsha");
//   res.send(`Middleware not about`)
//   console.log("About")
// })

app.listen(PORT, () => { console.log(`Server is listening at ${Date()} on port: ${PORT}`) })