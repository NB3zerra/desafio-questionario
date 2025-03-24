// filepath: /workspaces/desafio-questionario/app.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const questionariosRouter = require('./routes/questionarios');
app.use('/questionarios', questionariosRouter);

app.get('/', (req, res) => {
  res.redirect('/questionarios');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});