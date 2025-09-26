// server.js
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router('./data/db.json');
const middlewares = jsonServer.defaults();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(middlewares);
app.use(jsonServer.bodyParser);

app.db = router.db;
app.use(auth);
app.use(router);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
