const db = require('./db');

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
    db.end()
    .then(() => {
      console.log('Closed the database connections');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing connection', err);
      process.exit(1);
    });
}

module.exports = shutDown;