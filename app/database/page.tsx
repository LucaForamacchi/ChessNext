'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { getTutteLePartite } from '../database/db';

interface Partita {
  vincitore: string;
  mosse: string;
  data: string;
}
let mosse: string;
let vincitore: string;

export default function PartitePage() {
  const [partiteFromDB, setPartiteFromDB] = useState<Partita[]>([]);
  const [rigaSelezionata, setRigaSelezionata] = useState<number | null>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hover1vs1, setHover] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchPartite = async () => {
      try {
        const partite = await getTutteLePartite();
        setPartiteFromDB(partite);
      } catch (error) {
        console.error('Errore durante il recupero delle partite:', error);
      }
    };

    fetchPartite();
  }, []);

  const handleRigaCliccata = (index: number) => {
    const mosseRigaSelezionata = partiteFromDB[index].mosse;
    mosse=mosseRigaSelezionata;
    vincitore=partiteFromDB[index].vincitore;
    setRigaSelezionata(index);
    router.push('/analisipartita');
  };

  const handleRowHover = (index: number) => {
    setHoveredRowIndex(index);
  };

  return (
    <main>
      <div className="button-wrapper" style={{ position: 'absolute', top: 10, right: 10 }}>
        <Link href="/" passHref>
          <button
            style={{ padding: '10px 20px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Indietro
          </button>
        </Link>
      </div>
    <div style={{ backgroundColor: '#c3e6cb', color: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize:'40px' }}>Archivio partite</h1>
        {partiteFromDB.length > 0 ? (
          <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%', backgroundColor: 'white', fontSize: '16px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Vincitore</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Mosse</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {partiteFromDB.map((partita: Partita, index: number) => (
                <tr key={index} onClick={() => handleRigaCliccata(index)} style={{ backgroundColor: rigaSelezionata === index || hoveredRowIndex === index ? 'yellow' : 'inherit', cursor: 'pointer' }} onMouseEnter={() => handleRowHover(index)} onMouseLeave={() => setHoveredRowIndex(null)}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{partita.vincitore}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{partita.mosse}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{partita.data.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: '16px', textAlign: 'center' }}>Nessuna partita trovata</p>
        )}
      </div>
    </div>
    </main>
  );
}

export {mosse};
export {vincitore};