import Link from 'next/link'
//questa è la pagina iniziale, per passare a un'altra pagina bisogna creare una cartella con il nome che si vuole dentro alla root /app
//e quindi creare il file page.tsx che sarà la pagina in sé.
export default function Page() {
  return <Link href="/scacchiera">scacchiera</Link>
}
