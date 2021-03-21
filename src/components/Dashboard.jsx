import React, { useEffect, useState } from "react";
import { Company } from "./Company";
import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import { DATA } from "./data.js";
import ls from "local-storage";
import Modal from "react-modal";
import ModalView from "./ModalView";
import { process, addToStage, filterReturn, formatDate } from "../utils/Parser";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Sankey } from "./Sankey";
import CommandInput from "./CommandInput";

export function Dashboard() {
  // eslint-disable-next-line
  const [board, setBoard] = useState(ls.get("board") || DATA);
  const [showModal, setShowModal] = useState(false);
  const [modalCompany, setModalCompany] = useState({ name: "", actions: [] });
  const [selected, setSelected] = useState([new Set(), ""]);

  useEffect(() => {
    nlp.extend(nlpdates);
    nlp.extend(nlpnumbers);
    console.log(nlp);
  }, []);

  const reset = () => {
    if (selected[0].size !== 0 || selected[1] !== "")
      setSelected([new Set(), ""]);
  };

  const highlighter = (e) => {
    let text = e.target.value;
    let enter = e.key === "Enter";
    let [newBoard, newInfo, newSelected, resetFlag] = process(
      text,
      enter,
      board
    );
    if (resetFlag === 0) {
      setSelected(newSelected);
    }
    if (resetFlag === 2) {
      setSelected(newSelected);
      setBoard(newBoard);
      ls.set("board", newBoard);
    }
    if (resetFlag !== 0) {
      reset();
    }
    return [newInfo, resetFlag];
  };

  const handleOnDragEnd = (result) => {
    // let src = result.source.droppableId;
    if (!!result.destination) {
      let dst = result.destination.droppableId;
      let idx = result.destination.index;
      let name = result.draggableId;
      let newBoard = JSON.parse(JSON.stringify(board));
      let obj = filterReturn(newBoard, name, dst, formatDate())[0];
      addToStage(newBoard, dst, obj, idx);
      setBoard(newBoard);
      ls.set("board", newBoard);
    }
  };

  const getBackgroundColor = (key, snapshot) => {
    if (key.toLowerCase() === selected[1].toLowerCase()) return "bg-green-200";
    if (snapshot.isDraggingOver) return "bg-green-200";
    if (snapshot.draggingFromThisWith) return "bg-indigo-200";
    return "bg-blue-100";
  };

  return (
    <>
      <div className="text-center text-4xl mt-8 font-light tracking-wide">
        Dashboard
      </div>
      <Modal
        isOpen={showModal}
        className="bg-white border-2 border-gray-400 absolute top-10 right-10 left-10 bottom-10 rounded-md outline-none overflow-y-scroll overflow-x-hidden"
      >
        <ModalView company={modalCompany} setShowModal={setShowModal} />
      </Modal>
      <CommandInput highlighter={highlighter} />
      <div className="">
        <div className="px-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 text-center">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.keys(board).map((key) => (
              <Droppable droppableId={key}>
                {(provided, snapshot) => (
                  <div
                    className={
                      "rounded-xl shadow-xl p-4 flex flex-col " +
                      getBackgroundColor(key, snapshot)
                    }
                  >
                    <div className="">
                      <div className="flex">
                        <h1 className="text-2xl font-medium pb-4 flex-1 text-left">
                          {key}
                        </h1>
                        <h1 className="text-2xl ">{board[key].length}</h1>
                      </div>
                    </div>
                    <div
                      className="flex-1"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from(board[key]).map((company, id) => (
                          <Draggable
                            key={company.name}
                            draggableId={company.name}
                            index={id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Company
                                  company={company}
                                  highlight={selected[0].has(
                                    company.name.toLowerCase()
                                  )}
                                  click={() => {
                                    setModalCompany(company);
                                    setShowModal(true);
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>{" "}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>
      <Sankey board={board} />
    </>
  );
}
