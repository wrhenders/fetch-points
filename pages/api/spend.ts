import { repo } from "../../components/repo";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return newSpend();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  function newSpend() {
    const { points } = JSON.parse(req.body);
    const balance = repo.currentBalance();
    const pointSpend = parseInt(points);
    const isValid = (): boolean => {
      return !isNaN(pointSpend) && pointSpend <= balance;
    };
    if (!isValid()) {
      return res.status(400).json({ message: "Must have valid points" });
    }
    const spendData = repo.newSpend(points);
    return res.status(200).json({ spendData });
  }
}
