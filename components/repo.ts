import fs from "fs";

// get data from JSON db
const db = require("../db.json");
let log: [{ payer: string; points: number; date: string; seen: boolean }] =
  db.log;
let pointsMap: { [payer: string]: number } = db.pointsMap;

export const repo = {
  getBalance,
  newTransaction,
  newSpend,
  currentBalance,
};

// get balance: returns current pointsMap
function getBalance() {
  return pointsMap;
}

// newTransaction: takes payer, points and date, validates,
// appends to log, sorts based on timestamp, updates pointsMap
// writes to db
function newTransaction(payer: string, points: number, date: string) {
  log.push({ payer, points, date, seen: false });

  log.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  pointsMap[payer] ? (pointsMap[payer] += points) : (pointsMap[payer] = points);
  if (pointsMap[payer] < 0) pointsMap[payer] = 0;

  // saveData();
}

// spend: takes point to spend, validates enough points,
// walks log to determine where points get spent, returns array of payers
function newSpend(pointsToSpend: number) {
  let balance = currentBalance();
  if (pointsToSpend > balance) {
    throw new Error("Not enough points");
  }

  const spentPoints: { [payer: string]: number } = {};
  for (let tx of log) {
    // if tx seen and used, continue
    if (tx.seen) continue;
    let payerPoints = pointsMap[tx.payer];
    // if the payer is out of points, continue
    if (payerPoints === 0) continue;

    if (pointsToSpend > 0) {
      // if total payer points is less than tx points, then there is a skipped negative point
      // so modify tx.points to not spend more than total
      if (tx.points > payerPoints) tx.points = payerPoints;

      // if spending points is more than payer points and the tx has positive points
      // add tx and reduce spending points by tx amout and mark seen
      if (pointsToSpend >= tx.points && tx.points > 0) {
        // check if exists in hashmap, if so subtract, if not begin with points taken
        spentPoints[tx.payer]
          ? (spentPoints[tx.payer] -= tx.points)
          : (spentPoints[tx.payer] = -tx.points);
        // update pointsMap and points to spend
        pointsMap[tx.payer] -= tx.points;
        pointsToSpend -= tx.points;
        tx.seen = true;
        // else if spending points is more than payer points and the tx has negative points
        // check if payer has points in spentPoints, and its more than the negative tx
      } else if (pointsToSpend >= tx.points && tx.points < 0) {
        if (spentPoints[tx.payer]) {
          if (spentPoints[tx.payer] - tx.points < 0) {
            spentPoints[tx.payer] -= tx.points;
            pointsMap[tx.payer] -= tx.points;
            pointsToSpend -= tx.points;
            tx.seen = true;
          }
        }
        // else if spending points is less than payer points on the tx
        // add remaining pointsToSpend to spentPoints, reduce points left on tx
      } else if (pointsToSpend < tx.points) {
        spentPoints[tx.payer]
          ? (spentPoints[tx.payer] -= pointsToSpend)
          : (spentPoints[tx.payer] = -pointsToSpend);
        pointsMap[tx.payer] -= pointsToSpend;
        tx.points -= pointsToSpend;
        pointsToSpend = 0;
      }
    }
  }

  // save data
  // saveData();

  // format spentPoints hashmap as an array and return
  const returnArr = [];
  for (let payer in spentPoints) {
    returnArr.push({ payer, points: spentPoints[payer] });
  }
  return returnArr;
}

// sums balance of points from all payers, return points number
function currentBalance() {
  let balance = 0;
  for (let payer in pointsMap) {
    balance += pointsMap[payer];
  }
  return balance;
}

// write to JSON db
function saveData() {
  fs.writeFileSync("db.json", JSON.stringify({ log, pointsMap }, null, 2));
}
