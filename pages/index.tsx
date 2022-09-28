import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
const url = process.env.NEXT_PUBLIC_SERVER_URL;

export const getServerSideProps: GetServerSideProps = async () => {
  const balanceRes = await fetch(`${url}/api/balance`, {
    method: "GET",
  });
  const balance = await balanceRes.json();
  console.log(balance, typeof balance);
  return {
    props: { balance },
  };
};

interface Props {
  balance: { [payer: string]: number };
}

export default function Home({ balance }: Props) {
  const displayBalance = () => {
    return Object.keys(balance).map((payer) => {
      return (
        <tr key={payer}>
          <td>{payer + ":" + balance[payer]}</td>
        </tr>
      );
    });
  };

  let total = 0;
  for (let payer in balance) {
    total += balance[payer];
  }

  return (
    <Layout>
      <h3>Current Balance: {total} points</h3>
      <table
        style={{
          textAlign: "center",
          padding: "10px",
        }}
      >
        <tbody>{displayBalance()}</tbody>
      </table>
    </Layout>
  );
}
