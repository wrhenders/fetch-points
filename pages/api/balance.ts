import { repo } from "../../components/repo";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getBalance();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getBalance() {
    const balance = await repo.getBalance();
    return res.status(200).json(balance);
  }
}
