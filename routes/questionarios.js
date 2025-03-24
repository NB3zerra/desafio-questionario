// filepath: /workspaces/desafio-questionario/routes/questionarios.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Criação das tabelas de questionários e respostas
db.serialize(() => {
  db.run("CREATE TABLE questionarios (id INTEGER PRIMARY KEY, titulo TEXT, perguntas TEXT)");
  db.run("CREATE TABLE respostas (id INTEGER PRIMARY KEY, questionario_id INTEGER, resposta TEXT, FOREIGN KEY(questionario_id) REFERENCES questionarios(id))");
});

// Rota para listar questionários
router.get('/', (req, res) => {
  db.all("SELECT * FROM questionarios", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('questionarios', { questionarios: rows });
  });
});

// Rota para criar um novo questionário
router.post('/novo', (req, res) => {
  const { titulo, perguntas } = req.body;
  db.run("INSERT INTO questionarios (titulo, perguntas) VALUES (?, ?)", [titulo, perguntas], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.redirect('/questionarios');
  });
});

// Rota para exibir um questionário específico
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM questionarios WHERE id = ?", [id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      res.render('exibirQuestionario', { questionario: row });
    } else {
      res.status(404).send('Questionário não encontrado');
    }
  });
});

// Rota para recuperar as respostas de um questionário específico
router.get('/:id/respostas', (req, res) => {
  const id = req.params.id;
  db.all("SELECT * FROM respostas WHERE questionario_id = ?", [id], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('exibirRespostas', { respostas: rows });
  });
});

// Rota para processar as respostas do questionário
router.post('/responder', (req, res) => {
  const { id, respostas } = req.body;
  const respostasArray = Array.isArray(respostas) ? respostas : [respostas];

  const stmt = db.prepare("INSERT INTO respostas (questionario_id, resposta) VALUES (?, ?)");
  respostasArray.forEach(resposta => {
    stmt.run(id, resposta);
  });
  stmt.finalize();

  console.log(`Respostas do questionário ${id}:`, respostasArray);
  res.send('Respostas recebidas com sucesso!');
  alert('Respostas recebidas com sucesso!');
});

module.exports = router;