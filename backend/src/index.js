const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const stakingRoutes = require('./routes/stakingRoutes');
const daoRoutes = require('./routes/daoRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/dao', daoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
