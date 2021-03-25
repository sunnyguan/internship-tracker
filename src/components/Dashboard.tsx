import React, { useEffect, useState } from "react";
import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import { DATA } from "../types/data";
import * as ls from "local-storage";
import { Sankey } from "./Sankey";
import CommandInput from "./CommandInput";
import Timeline from "./Timeline";
import Stats from "./Stats";
import Footer from "./Footer";
import { boardType } from "../types/board";

export function Dashboard() {
  const getValidBoard = (): boardType => {
    let lsBoard: boardType = ls.get("board");
    try {
      Object.keys(lsBoard).forEach((company) => {
        let name = lsBoard[company].name;
        let actions = lsBoard[company].actions.length;
        if (!name || !actions) ls.set("board", DATA);
      });
    } catch (e) {
      ls.set("board", DATA);
    }
    // ls.set("board", DATA);
    return ls.get("board");
  };

  const [board, setBoard] = useState<boardType>(getValidBoard());

  useEffect(() => {
    nlp.extend(nlpdates);
    nlp.extend(nlpnumbers);
    console.log(nlp);
  }, []);

  const updateBoard = (newBoard: boardType) => {
    setBoard(newBoard);
    ls.set("board", newBoard);
    console.log(ls.get("board"));
  };

  const validate = (testBoard: any): boolean => {
    let valid = true;
    Object.keys(testBoard).forEach((key) => {
      let company = testBoard[key];
      if (!company.name || !company.actions) valid = false;
      else {
        company.actions.forEach((action: any) => {
          if (!action.stage || !action.date) valid = false;
        });
      }
    });
    return valid;
  };

  const handleUpload = (e: any) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        let res = e.target?.result;
        let js = JSON.parse(res as string);
        if (validate(js)) updateBoard(js);
        else alert("file invalid");
      };
    } catch (error) {
      alert("file invalid");
    }
  };

  const downloadJSON = (e: any) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(board)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "applications.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="bg-indigo-200">
      <div className="p-8">
        <div className="flex gap-4">
          <div className="text-4xl font-light tracking-wide flex-1">
            Internship Tracker
          </div>
          <button
            className="btn"
            onClick={() => {
              document.getElementById("fileInput")?.click();
            }}
          >
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
              id="fileInput"
            />
            Import
          </button>
          <button className="btn" onClick={downloadJSON}>
            Export
          </button>
        </div>
        <CommandInput updateBoard={updateBoard} board={board} />
      </div>
      <Timeline board={board} />
      <Sankey board={board} />
      <Stats board={board} />
      <Footer />
    </div>
  );
}
