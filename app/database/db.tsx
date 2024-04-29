'use server';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scacchi'
});

// Funzione per ottenere tutte le partite dalla tabella "partite"
interface Partita {
  vincitore: string;
  mosse: string;
  data: string;
  // altre proprietà della partita
}

export async function getTutteLePartite(): Promise<Partita[]> {
  return new Promise<Partita[]>((resolve, reject) => {
    if (connection) {
      const query = 'SELECT * FROM partite';
      connection.query(query, (error: any, results: any[], fields: any) => {
        if (error) {
          reject(error);
        } else {
          // Converto le righe restituite dal database in oggetti plain
          const partite: Partita[] = results.map(row => ({
            vincitore: row.vincitore,
            mosse: row.mosse,
            data: row.data
          }));
          resolve(partite);
        }
      });
    } else {
      const error = new Error('Connessione al database non stabilita.');
      reject(error);
    }
  });
}

