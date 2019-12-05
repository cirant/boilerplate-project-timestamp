// server.js
// where your node app starts

// init project
var createError = require('http-errors')
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({
  optionSuccessStatus: 200
})); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
const validator = (req, res, next) => {
  const {
    date_string
  } = req.params;
  if (date_string === undefined) {
    const now = new Date();
    req.params.date_string = now.toUTCString();
    req.isNaN = true;
    next();
  } else {
    req.isNaN = isNaN(date_string);
    const validDate = req.isNaN ? new Date(date_string) : new Date(Number(date_string));
    if (validDate.toUTCString() === 'Invalid Date') {
      return next(createError(400, 'invalid date'))
    } else {
      next();
    }
  }

}

const dateControler = (req, res, next) => {
  try {
    const {
      date_string
    } = req.params;
    const date = req.isNaN ? new Date(date_string) : new Date(Number(date_string));
    console.log(date.getMilliseconds());
    res.status(200).json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  } catch (error) {
    next(error);
  }
};

app.get("/api/timestamp/", validator, dateControler);
app.get("/api/timestamp/:date_string", validator, dateControler);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  res.status(err.status || 500).json(err);
  next();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});