require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[CMMC Server] Running on http://localhost:${PORT}`);
  console.log(`[CMMC Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});
