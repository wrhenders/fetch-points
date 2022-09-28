import fs from "fs";
import { Transaction, Payer } from "../interfaces";

// get data from JSON db
const db = require("../db.json");

let log: Transaction[] = db.log;
let currentBalance: number = db.currentBalance;
let pointsMap = db.pointsMap;

export const repo = {
  getBalance,
  newTransaction,
  //newSpend,
};

// get balance: returns current pointsMap
function getBalance() {
  return pointsMap;
}

// newTransaction: takes payer, points and date, validates,
// appends to log, sorts based on timestamp, updates pointsMap & currentBalance
// writes to db
function newTransaction(payer: string, points: number, date: string) {
  const data: Transaction = { payer, points, date };
  log.push(data);
  log.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  pointsMap[payer] ? (pointsMap[payer] += points) : (pointsMap[payer] = points);
  currentBalance += points;
  saveData();
}

// spend: takes point to spend, validates enough points
// create spentPoints[]
// for (let payer of log)
//  pointsToSpend > 0
// if pointsToSpend >= payer.points
// add payer to spentPoints
// pointsToSpend -= payer.points
// payer.points = 0
// payer has more points than pointsToSpend
// add partial payer to spentPoints
// payer.points -= pointsToSpend
// pointsToSpend = 0
// create ret{}
// for (let transaction of spentPoints)
// if(ret[!transaction.payer]) ret[transaction.payer]=0
// ret[transaction.payer] -= trasaction.points
// currentBalance -= transaction.points
// pointsMap[transaction.payer] -= transaction.points
// return ret{}
// writes to db

function saveData() {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ log, currentBalance, pointsMap }, null, 2)
  );
}
