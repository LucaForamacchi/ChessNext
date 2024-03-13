"use client"; 
import Link from 'next/link';
import { useState } from 'react';

// Componente del logo
const Logo = () => (
  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
    Scacchi in next by luca e alberto
  </div>
);

export default function Page() {
  const [hover1vs1, setHover1vs1] = useState(false);
  const [hover1vsBot, setHover1vsBot] = useState(false);

  return (
    <div style={{ backgroundColor: '#c3e6cb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Logo />
      <Link href="/scacchiera" passHref>
        <button
          style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
          onMouseEnter={() => setHover1vs1(true)}
          onMouseLeave={() => setHover1vs1(false)}
        >
          1vs1
        </button>
      </Link>
      <Link href="/scacchiera" passHref>
        <button
          style={{ margin: '10px', padding: '10px 20px', backgroundColor: hover1vsBot ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
          onMouseEnter={() => setHover1vsBot(true)}
          onMouseLeave={() => setHover1vsBot(false)}
        >
          1vsbot
        </button>
      </Link>
    </div>
  );
}

