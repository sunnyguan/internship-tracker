import React, { useEffect, useState } from "react";
import { Company } from "./Company";
import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import { DATA } from "./data.js";
import ls from "local-storage";

export function Dashboard() {
  // eslint-disable-next-line
  const [board, setBoard] = useState(ls.get("board") || DATA);

  useEffect(() => {
    nlp.extend(nlpdates);
    nlp.extend(nlpnumbers);
    console.log(nlp);
  }, []);

  const [selected, setSelected] = useState([new Set(), ""]);
  const [inputValue, setInputValue] = useState("");

  const keys = ["applied", "oa", "phone", "final", "offer", "rejected"];
  const str = keys.join("|");

  const [info, setInfo] = useState("");

  const addOrMoveMatch = `(move|change|update|switch|add|insert|append|prepend)? [<company>.+] to [<stage>(${str})] stage?`;

  const deleteMatcher = `(remove|delete) [<company>.+]`;

  const toLowerCaseSet = (list) => {
    return new Set(list.map((item) => item.toLowerCase()));
  };
  const highlighter = (e) => {
    let text = e.target.value;
    console.log(text);
    let doc = nlp(text);
    let addMoveMatch = doc.match(addOrMoveMatch);
    let deleteMatch = doc.match(deleteMatcher);

    let dateObj = doc.dates().get(0);
    if (!dateObj) dateObj = new Date();
    else dateObj = new Date(dateObj.start);
    let date = dateObj.getUTCMonth() + 1 + "/" + dateObj.getUTCDate();

    if (addMoveMatch.text() !== "") {
      let companies = addMoveMatch
        .groups("company")
        .text()
        .split(",")
        .map((item) => item.trim());
      let stage = addMoveMatch.groups("stage").text();
      let processed = "";
      companies.forEach((comp) => {
        processed += `<span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md mx-1'>${comp}</span>`;
      });
      processed += ` to 
        <span class='bg-green-200 px-2 py-1 rounded-md shadow-md'>${stage}</span>
      `;
      setSelected([toLowerCaseSet(companies), stage]);
      console.log(selected[0]);
      console.log(board);
      setInfo(processed);

      if (e.key === "Enter") {
        let removed = false;
        let added = false;
        companies.forEach((company) => {
          let obj = { name: company, actions: [] };
          Object.keys(board).forEach((group) => {
            board[group].forEach((item) => {
              if (item.name.toLowerCase() === company.toLowerCase()) {
                obj = item;
              }
            });
            board[group] = board[group].filter(
              (item) => item.name.toLowerCase() !== company.toLowerCase()
            );
          });
          obj.actions.push(`Moved to ${stage} on ${date}`);
          Object.keys(board).forEach((group) => {
            if (group.toLowerCase() === stage.toLowerCase()) {
              board[group].push(obj);
              added = true;
            }
          });
          ls.set("board", board);
        });
        if (removed || added) {
          setInputValue("");
        }
      }
    } else if (deleteMatch.text() !== "") {
      let company = deleteMatch.groups("company").text();
      let processed = `
        delete <span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md'>${company}</span>
      `;
      setSelected([new Set([company]), ""]);
      setInfo(processed);
      if (e.key === "Enter") {
        let removed = false;
        Object.keys(board).forEach((group) => {
          let size1 = board[group].length;
          board[group] = board[group].filter(
            (item) => item.name.toLowerCase() !== company.toLowerCase()
          );
          if (board[group].length !== size1) removed = true;
        });
        ls.set("board", board);
        if (removed) setInputValue("");
      }
    } else {
      if (info !== "") setInfo("");
      if (selected[0] !== "" || selected[1] !== "")
        setSelected([new Set(), ""]);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="text-center text-4xl mt-8 font-light tracking-wide">
        Dashboard
      </div>
      <div className="px-8 header text-center mb-4">
        <input
          contentEditable="true"
          className="mt-4 ring-blue-200 mr-4 py-2 px-4 rounded-lg placeholder-gray-400 text-gray-900 inline-block shadow-md focus:outline-none ring-2 focus:ring-blue-600 w-full bg-white text-center"
          placeholder="Enter updates here..."
          onKeyUp={highlighter}
          onChange={handleChange}
          value={inputValue}
        />
        <div
          className="p-4 h-16"
          dangerouslySetInnerHTML={{ __html: info }}
        ></div>
      </div>
      <div className="">
        <div className="px-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 text-center">
          {Object.keys(board).map((key) => (
            <div
              className={
                "rounded-xl shadow-xl p-4 " +
                (key.toLowerCase() === selected[1].toLowerCase()
                  ? "bg-green-200"
                  : "bg-blue-100")
              }
            >
              <h1 className="text-2xl font-medium pb-4">{key}</h1>
              <div className="grid grid-cols-1 gap-4">
                {Array.from(board[key]).map((company) => (
                  <Company
                    company={company}
                    highlight={selected[0].has(company.name.toLowerCase())}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
