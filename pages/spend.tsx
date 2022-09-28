import Layout from "../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
const url = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Spend() {
  const [points, setPoints] = useState("");

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid()) {
      alert("All entries must be filled and valid");
      return;
    }
    const data = {
      points: parseInt(points),
    };

    fetch(`${url}/api/spend/`, {
      method: "POST",
      headers: { "Content-Type": "application.json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status !== 200) throw Error("Incorrect inputs");
        return res.json();
      })
      .then((res) => {
        console.log(res);
        router.push("/");
      })
      .catch((err) => alert(err.message));
  };

  const isValid = (): boolean => {
    return !isNaN(parseInt(points));
  };

  return (
    <Layout>
      <h2 style={{ color: "#7C7C7C" }}>New Spend</h2>
      <form style={{ width: "60%" }} onSubmit={handleSubmit}>
        <label>Quantity:</label>
        <input
          id="points"
          type="text"
          placeholder="Points..."
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
}
