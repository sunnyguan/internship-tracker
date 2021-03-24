import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import { boardType } from "../types/board";

nlp.extend(nlpdates);
nlp.extend(nlpnumbers);

type companyType = Array<string>;

const addOrMoveMatch = `(move|change|update|switch|add|insert|append|prepend)? [<company>.+] to [<stage>.] stage?`;
const deleteMatcher = `(remove|delete) [<company>.+]`;

export const addToStage = (
  board: boardType,
  company: string,
  stage: string,
  date: string
) => {
  let lowerCompany = company.toLowerCase();
  if (!(lowerCompany in board))
    board[lowerCompany] = { name: company, actions: [] };
  board[lowerCompany].actions.push({ stage: stage, date: date });
};

const generateProcessed = (
  companies: companyType,
  stage: string,
  date: string
) => {
  let processed = "";
  companies.forEach((comp) => {
    processed += `<span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md mx-1'>${comp}</span>`;
  });
  processed += ` to 
    <span class='bg-green-200 px-2 py-1 rounded-md shadow-md'>${stage}</span>
    on
    <span class='bg-yellow-200 px-2 py-1 rounded-md shadow-md'>${formatDate(
      date
    )}</span>
  `;
  return processed;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (dateString: string) => {
  let dateObj = new Date(dateString);
  let str =
    monthNames[dateObj.getUTCMonth()] +
    " " +
    dateObj.getUTCDate() +
    ", " +
    dateObj.getUTCFullYear();
  return str;
};

export const generateDeleted = (companies: companyType) => {
  let processed = "delete ";
  companies.forEach((company) => {
    processed += `<span class='mx-1 bg-indigo-300 px-2 py-1 rounded-md shadow-md'>${company}</span>`;
  });
  return processed;
};

export const process = (text: string, enter: boolean, oldBoard: boardType) => {
  let board = JSON.parse(JSON.stringify(oldBoard));
  let doc = nlp(text);
  let addMoveMatch = doc.match(addOrMoveMatch);
  let deleteMatch = doc.match(deleteMatcher);

  let info = "";
  let resetFlag = 0;

  if (addMoveMatch.text() !== "") {
    let companies = addMoveMatch
      .groups("company")
      .text()
      .split(",")
      .map((item) => item.trim());
    let stage = addMoveMatch.groups("stage").text();
    let dateObj = (doc as any).dates().get(0);
    let date = new Date().toISOString();
    if (!!dateObj) date = new Date(dateObj.start).toISOString();

    info = generateProcessed(companies, stage, date);

    if (enter) {
      companies.forEach((company) => {
        addToStage(board, company, stage, date);
      });
      resetFlag = 2;
    }
  } else if (deleteMatch.text() !== "") {
    let companies = deleteMatch
      .groups("company")
      .text()
      .split(",")
      .map((item) => item.trim());
    info = generateDeleted(companies);
    if (enter) {
      companies.forEach((company) => {
        delete board[company.toLowerCase()];
      });
      resetFlag = 2;
    }
  } else {
    resetFlag = 1;
  }
  return [board, info, resetFlag];
};
