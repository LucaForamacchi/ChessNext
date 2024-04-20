'use client';
import React, { useState } from 'react';
import { getTutteLePartite } from './db';

export default function PartitePage() {
  const [partite, setPartite] = useState([]);

  const fetchPartite = async () => {
    try {
      const partiteFromDB = await getTutteLePartite();
      setPartite(partiteFromDB);
    } catch (error) {
      console.error('Errore durante il recupero delle partite:', error);
    }
  };

  // Chiamiamo la funzione fetchPartite quando il componente si monta
  React.useEffect(() => {
    fetchPartite();
  }, []); 

  return (
    <div>
      <h1>Partite</h1>
      <ul>
        {partite.map((partita: any) => (
          <li key={partita.id}>
            {partita.nome_giocatore1} vs {partita.nome_giocatore2}
          </li>
        ))}
      </ul>
    </div>
  );
}
