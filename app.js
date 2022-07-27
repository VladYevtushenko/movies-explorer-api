const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
// const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/handleErrors');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use(cors);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  // Если работает
  // eslint-disable-next-line no-console
  console.log(`server launched at: ${PORT}`);
});
