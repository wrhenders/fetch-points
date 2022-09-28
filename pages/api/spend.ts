import { repo } from "../../components/repo";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return newSpend();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function newSpend() {
    const points = req.body.points;
    const isValid = (): boolean => {
      return !isNaN(parseInt(points));
    };
    if (!isValid()) {
      return res.status(400).json({ message: "Must have valid points" });
    }
    try {
      const spendData = await repo.newSpend(points);
      return res.status(200).json({ spendData });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}
