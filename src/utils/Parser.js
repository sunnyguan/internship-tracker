import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";

nlp.extend(nlpdates);
nlp.extend(nlpnumbers);

const keys = ["applied", "oa", "phone", "final", "offer", "rejected"];
const str = keys.join("|");

const addOrMoveMatch = `(move|change|update|switch|add|insert|append|prepend)? [<company>.+] to [<stage>(${str})] stage?`;

const deleteMatcher = `(remove|delete) [<company>.+]`;

const toLowerCaseSet = (list) => {
  return new Set(list.map((item) => item.toLowerCase()));
};

export const filterReturn = (
  board,
  match,
  stage = "n/a",
  date = new Date()
) => {
  let obj = { name: match, actions: [] };
  let stageName = stage;
  let deleted = false;
  Object.keys(board).forEach((group) => {
    if (group.toLowerCase() === stage.toLowerCase()) stageName = group;
    board[group].forEach((item) => {
      if (item.name.toLowerCase() === match.toLowerCase()) obj = item;
    });
    let initSize = board[group].length;
    board[group] = board[group].filter(
      (item) => item.name.toLowerCase() !== match.toLowerCase()
    );
    if (board[group].length !== initSize) deleted = true;
  });
  if (stage !== "n/a") obj.actions.push({ stage: stageName, date: date });
  return [obj, deleted];
};

export const addToStage = (board, stage, obj, idx = 0) => {
  let added = false;
  Object.keys(board).forEach((group) => {
    if (group.toLowerCase() === stage.toLowerCase()) {
      board[group].splice(idx, 0, obj);
      added = true;
    }
  });
  return added;
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
  let str = monthNames[dateObj.getUTCMonth()] + " " + dateObj.getUTCDate();
  return str;
};

export const process = (text, enter, oldBoard) => {
  let board = JSON.parse(JSON.stringify(oldBoard));
  let doc = nlp(text);
  let addMoveMatch = doc.match(addOrMoveMatch);
  let deleteMatch = doc.match(deleteMatcher);

  let info = "";
  let selected = [new Set(), ""];
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
    selected = [toLowerCaseSet(companies), stage];

    if (enter) {
      let removed = false;
      let added = false;
      companies.forEach((company) => {
        let [obj, removedOne] = filterReturn(board, company, stage, date);
        removed |= removedOne;
        added |= addToStage(board, stage, obj);
      });
      if (removed || added) resetFlag = 2;
      console.log(board);
    }
  } else if (deleteMatch.text() !== "") {
    let company = deleteMatch.groups("company").text();
    info = `
        delete <span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md'>${company}</span>
      `;
    selected = [new Set([company]), ""];
    if (enter) {
      let removed = filterReturn(board, company)[1];
      if (removed) resetFlag = 2;
      console.log(board);
    }
  } else {
    resetFlag = 1;
  }
  return [board, info, selected, resetFlag];
};
