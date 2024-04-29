"use client"; 
import Link from 'next/link';

import React, { useState } from 'react';

// Componente del logo
const Logo = () => (
  <div style={{ fontSize: '35px', fontWeight: 'bold', marginBottom: '20px' }}>
    Scacchi in next by Luca e Alberto
  </div>
);

export default function Page() {
  
  const [hover1vs1, setHover1vs1] = useState(false);
  const [hover1vsBot, setHover1vsBot] = useState(false);
  const [hoverdatabase, setHoverdatabase] = useState(false);

  return (
    <div style={{ backgroundColor: '#c3e6cb', minHeight: '100vh', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Logo />
        <Link href="/scacchiera" passHref>
          <button
            style={{ margin: '7px', padding: '10px 20px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHover1vs1(true)}
            onMouseLeave={() => setHover1vs1(false)}
          >
            1 vs 1
          </button>
        </Link>
        <Link href="/bot" passHref>
          <button
            style={{ margin: '7px', padding: '10px 20px', backgroundColor: hover1vsBot ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHover1vsBot(true)}
            onMouseLeave={() => setHover1vsBot(false)}
          >
            1 vs Bot
          </button>
        </Link>
        <Link href="/database" passHref>
          <button
            style={{ margin: '7px', padding: '10px 20px', backgroundColor: hoverdatabase ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHoverdatabase(true)}
            onMouseLeave={() => setHoverdatabase(false)}
          >
            Partite passate
          </button>
        </Link>
      </div>
      <img className='background-image' src='immaginescacchi.png' style={{height: '705px'}}></img>
    </div>
  );
}

