import { useState } from "react";
import Chart from "react-google-charts";

const lineHeight = 40;

function Timeline({ board }) {
  const [height, setHeight] = useState("500px");

  const getData = (board) => {
    let data = [];
    let newHeight = Object.keys(board).length * lineHeight + 60 + "px";
    if (newHeight !== height) setHeight(newHeight);
    Object.keys(board).forEach((key) => {
      let company = board[key];
      let actions = company.actions;
      for (let i = 0; i < actions.length - 1; ++i) {
        let date1 = new Date(actions[i].date);
        let date2 = new Date(actions[i + 1].date);
        if (date1 <= date2) {
          data.push([
            company.name,
            actions[i].stage,
            new Date(actions[i].date),
            new Date(actions[i + 1].date),
          ]);
        }
      }
      if (actions.length >= 1) {
        let id = actions.length - 1;
        let lastDate = new Date(actions[id].date);
        let nextDate = new Date();
        if (lastDate.getTime() <= new Date().getTime()) nextDate = new Date();
        else nextDate.setDate(lastDate.getDate() + 2);
        data.push([company.name, actions[id].stage, lastDate, nextDate]);
      }
    });
    data.sort((o1, o2) => {
      return o1[2] - o2[2];
    });
    data.unshift([
      { type: "string", id: "Position" },
      { type: "string", id: "Name" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ]);
    return data;
  };
  if (Object.keys(board).length === 0) {
    // TODO cleaner look
    return <div className="text-center text-xl font-light">Empty Timeline</div>;
  }
  return (
    <div className="px-8 pt-4 bg-blue-100">
      <div className="text-3xl font-light text-center p-4">Timeline</div>
      <Chart
        key={height}
        width={"100%"}
        height={height}
        chartType="Timeline"
        loader={<div>Loading Chart</div>}
        data={getData(board)}
        rootProps={{ "data-testid": "3" }}
      />
    </div>
  );
}

export default Timeline;
