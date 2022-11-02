let express = require('express');

let { PORT } = require('./constants');

let routes = require('./routes');

let expressConfig = require('./config/expressConfig');
let hbsConfig = require('./config/hbsConfig');
let databaseConfig = require('./config/databaseConfig');

let app = express();

expressConfig(app);
hbsConfig(app);
databaseConfig();

app.use(routes);

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));