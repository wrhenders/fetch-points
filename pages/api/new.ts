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
    const payer = req.body.payer;
    const points = req.body.points;
    const date = req.body.date;
    const isValid = (): boolean => {
      return (
        payer !== "" && !isNaN(parseInt(points)) && !isNaN(Date.parse(date))
      );
    };
    if (!isValid()) {
      return res
        .status(400)
        .json({ message: "Must have valid payer, points and date" });
    }
    try {
      repo.newTransaction(payer, points, date);
      return res.status(200).json({});
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}
