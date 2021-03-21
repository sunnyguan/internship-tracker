import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import ls from "local-storage";

nlp.extend(nlpdates);
nlp.extend(nlpnumbers);

const keys = ["applied", "oa", "phone", "final", "offer", "rejected"];
const str = keys.join("|");

const addOrMoveMatch = `(move|change|update|switch|add|insert|append|prepend)? [<company>.+] to [<stage>(${str})] stage?`;

const deleteMatcher = `(remove|delete) [<company>.+]`;

const toLowerCaseSet = (list) => {
  return new Set(list.map((item) => item.toLowerCase()));
};

const filterReturn = (board, match) => {
  let obj = { name: match, actions: [] };
  let deleted = false;
  Object.keys(board).forEach((group) => {
    board[group].forEach((item) => {
      if (item.name.toLowerCase() === match.toLowerCase()) obj = item;
    });
    let initSize = board[group].length;
    board[group] = board[group].filter(
      (item) => item.name.toLowerCase() !== match.toLowerCase()
    );
    if (board[group].length !== initSize) deleted = true;
  });
  return [obj, deleted];
};

const addToStage = (board, stage, obj) => {
  let added = false;
  Object.keys(board).forEach((group) => {
    if (group.toLowerCase() === stage.toLowerCase()) {
      board[group].push(obj);
      added = true;
    }
  });
  return added;
};

const generateProcessed = (companies, stage) => {
  let processed = "";
  companies.forEach((comp) => {
    processed += `<span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md mx-1'>${comp}</span>`;
  });
  processed += ` to 
    <span class='bg-green-200 px-2 py-1 rounded-md shadow-md'>${stage}</span>
  `;
  return processed;
};

const formatDate = (dateObj) => {
  if (!dateObj) dateObj = new Date();
  else dateObj = new Date(dateObj.start);
  return dateObj.getUTCMonth() + 1 + "/" + dateObj.getUTCDate();
};

export const process = (text, enter, board) => {
  let doc = nlp(text);
  let addMoveMatch = doc.match(addOrMoveMatch);
  let deleteMatch = doc.match(deleteMatcher);

  let dateObj = doc.dates().get(0);
  let date = formatDate(dateObj);

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
    info = generateProcessed(companies, stage);
    selected = [toLowerCaseSet(companies), stage];

    if (enter) {
      let removed = false;
      let added = false;
      companies.forEach((company) => {
        let [obj, removedOne] = filterReturn(board, company);
        removed |= removedOne;

        obj.actions.push(`Moved to ${stage} on ${date}`);
        added |= addToStage(board, stage, obj);
        ls.set("board", board);
      });
      if(removed || added) resetFlag = 2;
    }
  } else if (deleteMatch.text() !== "") {
    let company = deleteMatch.groups("company").text();
    info = `
        delete <span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md'>${company}</span>
      `;
    selected = [new Set([company]), ""];
    if (enter) {
      let removed = filterReturn(board, company)[1];
      ls.set("board", board);
      if (removed) resetFlag = 2;
    }
  } else {
    resetFlag = 1;
  }

  return [info, selected, resetFlag];
};
