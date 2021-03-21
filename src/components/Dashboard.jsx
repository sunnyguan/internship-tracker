import React, { useState } from "react";
import { Company } from "./Company";
import nlp from "compromise";

export function Dashboard() {
  // eslint-disable-next-line
  const [board, setBoard] = useState({
    Applied: new Set(["IMC", "Bridgewater"]),
    OA: new Set(["Amazon", "Apple"]),
    Phone: new Set(["Facebook", "Google"]),
    Final: new Set(["Netflix"]),
    Offer: new Set(["Virtu"]),
    Rejected: new Set(["Whole Foods"]),
  });

  const [selected, setSelected] = useState(["", ""]);
  const [inputValue, setInputValue] = useState("");

  const keys = ["applied", "oa", "phone", "final", "offer", "rejected"];
  const str = keys.join("|");

  const [info, setInfo] = useState("");

  const addOrMoveMatch = `(move|change|update|switch|add|insert|append|prepend)? [<company>.+] to [<stage>(${str})] stage?`;

  const deleteMatcher = `(remove|delete) [<company>.+]`;

  const highlighter = (e) => {
    let text = e.target.value;
    console.log(text);
    let doc = nlp(text);
    let addMoveMatch = doc.match(addOrMoveMatch);
    let deleteMatch = doc.match(deleteMatcher);

    if (addMoveMatch.text() !== "") {
      let company = addMoveMatch.groups("company").text();
      let stage = addMoveMatch.groups("stage").text();
      let processed = `
        <span class='bg-indigo-300 px-2 py-1 rounded-md shadow-md'>${company}</span>
          to
        <span class='bg-green-300 px-2 py-1 rounded-md shadow-md'>${stage}</span>
      `;
      setSelected([company, stage]);
      setInfo(processed);
      if (e.key === "Enter") {
        let removed = false;
        let added = false;
        let capName = "";
        Object.keys(board).forEach((group) => {
          board[group].forEach((item) => {
            if (item.toLowerCase() === company.toLowerCase()) {
              board[group].delete(item);
              capName = item;
              removed = true;
            }
          });
        });
        Object.keys(board).forEach((group) => {
          if (group.toLowerCase() === stage.toLowerCase()) {
            if (capName !== "") board[group].add(capName);
            else board[group].add(company);
            added = true;
          }
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
      setSelected([company, ""]);
      setInfo(processed);
      if (e.key === "Enter") {
        let removed = false;
        Object.keys(board).forEach((group) => {
          board[group].forEach((item) => {
            if (item.toLowerCase() === company.toLowerCase()) {
              board[group].delete(item);
              removed = true;
            }
          });
        });
        if (removed) setInputValue("");
      }
    } else {
      if (info !== "") setInfo("");
      if (selected[0] !== "" || selected[1] !== "") setSelected(["", ""]);
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
                  ? "bg-green-300"
                  : "bg-blue-100")
              }
            >
              <h1 className="text-2xl font-medium pb-4">{key}</h1>
              <div className="grid grid-cols-1 gap-4">
                {Array.from(board[key]).map((company) => (
                  <Company
                    name={company}
                    highlight={
                      company.toLowerCase() === selected[0].toLowerCase()
                    }
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
