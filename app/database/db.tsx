let mysql;
if (typeof window === 'undefined') {
  mysql = require('mysql');
}

// Configurazione della connessione al database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scacchi' // Assicurati che il nome del database sia corretto
});
console.log("connesso al database");

// Funzione per ottenere tutte le partite dalla tabella "partite"
export async function getTutteLePartite() {
  return new Promise((resolve, reject) => {
    if (connection) {
      const query = 'SELECT * FROM partite';
      connection.query(query, (error: any, results: any, fields: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    } else {
      const error = new Error('Connessione al database non stabilita.');
      reject(error);
    }
  });
}



