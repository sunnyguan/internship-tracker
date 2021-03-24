import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";

nlp.extend(nlpdates);
nlp.extend(nlpnumbers);

const addOrMoveMatch = `(move|change|update|switch|add|insert|append|prepend)? [<company>.+] to [<stage>.] stage?`;
const deleteMatcher = `(remove|delete) [<company>.+]`;

export const addToStage = (board, company, stage, date) => {
  let lowerCompany = company.toLowerCase();
  if (!(lowerCompany in board))
    board[lowerCompany] = { name: company, actions: [] };
  board[lowerCompany].actions.push({ stage: stage, date: date });
};

const generateProcessed = (companies, stage, date) => {
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

export const formatDate = (dateString) => {
  let dateObj = new Date(dateString);
  let str = monthNames[dateObj.getUTCMonth()] + " " + dateObj.getUTCDate() + ", " + (dateObj.getUTCFullYear());
  return str;
};

export const process = (text, enter, oldBoard) => {
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
    let dateObj = doc.dates().get(0);
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
    let company = deleteMatch.groups("company").text();
    info = `
        delete <span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md'>${company}</span>
      `;
    if (enter) {
      delete board[company.toLowerCase()];
      resetFlag = 2;
    }
  } else {
    resetFlag = 1;
  }
  return [board, info, resetFlag];
};
