import React, { useEffect, useState } from "react";
import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import { DATA } from "./data.js";
import ls from "local-storage";
import { Sankey } from "./Sankey";
import CommandInput from "./CommandInput";
import Timeline from "./Timeline";
import Stats from "./Stats";
import Footer from "./Footer";

export function Dashboard() {
  const getValidBoard = () => {
    let lsBoard = ls.get("board");
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

  const [board, setBoard] = useState(getValidBoard());

  useEffect(() => {
    nlp.extend(nlpdates);
    nlp.extend(nlpnumbers);
    console.log(nlp);
  }, []);

  const updateBoard = (newBoard) => {
    setBoard(newBoard);
    ls.set("board", newBoard);
    console.log(ls.get("board"));
  };

  return (
    <div className="">
      <div className="p-4">
        <div className="text-center text-4xl font-light tracking-wide">
          Internship Tracker
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
