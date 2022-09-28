import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Points Tracker</title>
        <meta name="description" content="Manage Fetch Points" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Link href={"/"}>
            <a>Points Tracker</a>
          </Link>
        </h1>
        <span className={styles.navigation}>
          <Link href="/new">
            <button>New Transaction</button>
          </Link>
          <Link href="/spend">
            <button>Spend Points</button>
          </Link>
        </span>
        {props.children}
      </main>
    </div>
  );
}
