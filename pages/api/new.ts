import { repo } from "../../components/repo";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return newTransaction();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  function newTransaction() {
    const transaction = JSON.parse(req.body);
    const payer = transaction.payer;
    const points = parseInt(transaction.points);
    const date = transaction.date;

    const isValid = (): boolean => {
      return (
        typeof payer == "string" &&
        payer !== "" &&
        !isNaN(points) &&
        !isNaN(Date.parse(date))
      );
    };

    if (!isValid()) {
      return res
        .status(400)
        .json({ message: "Must have valid payer, points and date" });
    }

    repo.newTransaction(payer, points, date);
    return res.status(200).json({});
  }
}
