const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

var sqlite3 = require('sqlite3');

const port = 3000;

const app = express();

var db_nombre = 'database.db';
var db_existe = 0;

if(fs.existsSync(db_nombre)){
  db_existe = 1;
}

var db = new sqlite3.Database(db_nombre);

if(db_existe == 0){

  db.serialize(function() {

   db.run("CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY, contenido TEXT)");

   db.run("INSERT INTO notas (contenido) VALUES ('')");

  });

}

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {

  db.get("SELECT * FROM notas WHERE id = 1", function(err, row) {
    var contenido = row.contenido;
    var fecha = new Date().toLocaleDateString();
    var nuevo = "<br/><p style='text-align: center;'><b><font color='red'>" + fecha + "</font></b></p><br/><br/>...";
    res.render('home/index.pug', { contenido : contenido + nuevo });
   });

});

app.post('/guardar', (req, res) => {

  var contenido = req.body.contenido;

  db.run("UPDATE notas SET contenido = '" + contenido + "' WHERE id = 1");

  res.status(200).json({estado:200, mensaje:"Contenido actualizado"});

});

app.listen(port, () => console.log(`Servidor iniciado en el puerto http://localhost:${port}`));