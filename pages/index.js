import Head from 'next/head';
import styles from '../styles/globals.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>CarBot – Dein KI-Werkstattassistent</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.hero}>
          <h1>🚗 Willkommen bei <span>CarBot</span></h1>
          <p>Dein smarter KI-Chatbot für Werkstätten und Automotive-Services.</p>
          <a className={styles.cta} href="/demo">Demo starten</a>
        </div>
      </main>
    </>
  );
}
