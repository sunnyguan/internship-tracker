import { useState } from "react";
import Chart from "react-google-charts";
import { boardType, companyType, stageType } from "../types/board";
import ModalView from "./ModalView";

const lineHeight = 40;

type Props = {
  board: boardType;
  updateBoard: (board: boardType) => void;
};

function Timeline({ board, updateBoard }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState("500px");
  const [multiStages, setMultiStages] = useState(false);

  const duration = (start: Date, end: Date): number => {
    return Math.ceil((end.getTime() - start.getTime()) / 86400000);
  };

  const genTooltip = (
    company: companyType,
    stage: stageType,
    start: Date,
    end: Date
  ): string => {
    return `
    <div class="p-4 w-36">
      <p class="font-semibold">${stage.stage}: ${duration(start, end)} days</p>
      <p class="font-light">${stage.notes || ""}</p>
    </div>
  `;
  };

  const updateNote = (note: string) => {
    let company = selectedNote.company;
    let stage = selectedNote.stage;
    let done = false;
    let newBoard: boardType = JSON.parse(JSON.stringify(board));
    newBoard[company.toLowerCase()].actions.forEach((action) => {
      if (!done && action.stage === stage) {
        action.notes = note;
        done = true;
      }
    });
    updateBoard(newBoard);
  };

  const getNote = (company: string, stage: string) => {
    let done = false;
    let note = "";
    board[company.toLowerCase()].actions.forEach((action) => {
      if (!done && action.stage === stage) {
        note = action.notes as string;
        done = true;
      }
    });
    return note;
  }

  const getData = (board: boardType) => {
    let data: Array<any> = [];
    let newHeight = Object.keys(board).length * lineHeight + 60 + "px";
    if (newHeight !== height) setHeight(newHeight);
    Object.keys(board).forEach((key) => {
      let company = board[key];
      let actions = company.actions;

      if (multiStages && actions.length <= 1) return;

      for (let i = 0; i < actions.length - 1; ++i) {
        let date1 = new Date(actions[i].date);
        let date2 = new Date(actions[i + 1].date);
        if (date1 <= date2) {
          data.push([
            company.name,
            actions[i].stage,
            genTooltip(company, actions[i], date1, date2),
            new Date(actions[i].date),
            new Date(actions[i + 1].date),
          ]);
        }
      }
      if (actions.length >= 1) {
        let id = actions.length - 1;
        let lastDate = new Date(actions[id].date);
        let nextDate = new Date();
        if (lastDate.getTime() <= nextDate.getTime()) nextDate = new Date();
        else nextDate = new Date(lastDate.getTime() + 2 * 86400);
        data.push([
          company.name,
          actions[id].stage,
          genTooltip(company, actions[id], lastDate, nextDate),
          lastDate,
          nextDate,
        ]);
      }
    });
    data.sort((o1, o2) => {
      return o1[3].getTime() - o2[3].getTime();
    });
    data.unshift([
      { type: "string", id: "Position" },
      { type: "string", id: "Name" },
      { type: "string", role: "tooltip", p: { html: true } },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ]);
    return data;
  };

  const [selectedNote, setSelectedNote] = useState({ company: "", stage: "" });
  const [currNote, setCurrNote] = useState("");

  if (Object.keys(board).length === 0) {
    // TODO cleaner look
    return <div className="text-center text-xl font-light">Empty Timeline</div>;
  }
  return (
    <div className="px-8 pt-4 bg-blue-100">
      <div className="py-4 flex gap-4">
        <h1 className="font-light text-xl flex items-center">Filters:</h1>
        <button
          onClick={() => {
            setMultiStages(!multiStages);
          }}
          className="btn"
        >
          {multiStages ? "Show All" : "Show Only >1 Stages"}
        </button>
      </div>
      <Chart
        key={height}
        width={"100%"}
        height={height}
        chartType="Timeline"
        loader={<div>Loading Chart</div>}
        data={getData(board)}
        rootProps={{ "data-testid": "10" }}
        options={{
          tooltip: {
            isHtml: true,
          },
        }}
        chartEvents={[
          {
            eventName: "select",
            callback: ({ chartWrapper }) => {
              const chart = chartWrapper.getChart();
              const selection = chart.getSelection();
              if (selection.length === 1) {
                const [selectedItem] = selection;
                const dataTable = chartWrapper.getDataTable();
                const row = selectedItem.row;
                let company = dataTable?.getValue(row, 0) as string;
                let stage = dataTable?.getValue(row, 1) as string;
                setSelectedNote({ company: company, stage: stage });
                setCurrNote(getNote(company, stage));
                setShowModal(true);
              }
            },
          },
        ]}
      />
      <ModalView key={currNote} selection={selectedNote} showModal={showModal} closeModal={() => {setShowModal(false)}} updateNote={updateNote} initial={currNote} />
    </div>
  );
}

export default Timeline;
