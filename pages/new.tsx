import Layout from "../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { Transaction } from "../interfaces";
const url = process.env.NEXT_PUBLIC_SERVER_URL;

export default function NewTransaction() {
  const [payer, setPayer] = useState("");
  const [points, setPoints] = useState("");
  const [date, setDate] = useState("");

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid()) {
      alert("All entries must be filled and valid");
      return;
    }
    const data: Transaction = {
      payer,
      points: parseInt(points),
      date,
    };

    fetch(`${url}/api/new/`, {
      method: "POST",
      headers: { "Content-Type": "application.json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status !== 200) throw Error("Incorrect inputs");
        router.push("/");
      })
      .catch((err) => alert(err.message));
  };

  const isValid = (): boolean => {
    return payer !== "" && !isNaN(parseInt(points)) && !isNaN(Date.parse(date));
  };

  return (
    <Layout>
      <h2 style={{ color: "#7C7C7C" }}>New Transaction</h2>
      <form style={{ width: "60%" }} onSubmit={handleSubmit}>
        <label>Payer</label>
        <input
          id="payer"
          type="text"
          placeholder="Payer"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
        />
        <label>Quantity:</label>
        <input
          id="points"
          type="text"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <label>Timestamp:</label>
        <input
          id="date"
          type="text"
          placeholder="Date (In format '2020-11-02T14:00:00Z')"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
}
