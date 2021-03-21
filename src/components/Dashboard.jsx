import React, { useEffect, useState } from "react";
import { Company } from "./Company";
import nlp from "compromise";
import nlpdates from "compromise-dates";
import nlpnumbers from "compromise-numbers";
import { DATA } from "./data.js";
import ls from "local-storage";
import Modal from "react-modal";
import ModalView from "./ModalView";
import { process, addToStage, filterReturn } from "../utils/Parser";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export function Dashboard() {
  // eslint-disable-next-line
  const [board, setBoard] = useState(ls.get("board") || DATA);
  const [showModal, setShowModal] = useState(false);
  const [modalCompany, setModalCompany] = useState({ name: "", actions: [] });
  const [selected, setSelected] = useState([new Set(), ""]);
  const [inputValue, setInputValue] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    nlp.extend(nlpdates);
    nlp.extend(nlpnumbers);
    console.log(nlp);
  }, []);

  const reset = () => {
    if (info !== "") setInfo("");
    if (selected[0].size !== 0 || selected[1] !== "")
      setSelected([new Set(), ""]);
  };

  const highlighter = (e) => {
    let text = e.target.value;
    let enter = e.key === "Enter";
    let [board, info, selected, resetFlag] = process(text, enter, board);
    setInfo(info);
    setSelected(selected);
    setBoard(board);
    ls.set("board", board);
    if (resetFlag === 1 || resetFlag === 2) reset();
    if (resetFlag === 2) setInputValue("");
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnDragEnd = (result) => {
    // let src = result.source.droppableId;
    if (!!result.destination) {
      let dst = result.destination.droppableId;
      let idx = result.destination.index;
      let name = result.draggableId;
      let newBoard = JSON.parse(JSON.stringify(board));
      let obj = filterReturn(newBoard, name)[0];
      addToStage(newBoard, dst, obj, idx);
      setBoard(newBoard);
      ls.set("board", newBoard);
    }
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
      <div className="px-8 header text-center mb-4">
        <input
          className="mt-4 ring-blue-200 mr-4 py-2 px-4 rounded-lg placeholder-gray-400 text-gray-900 inline-block shadow-md focus:outline-none ring-2 focus:ring-blue-600 w-full bg-white text-center"
          placeholder="Try 'move IMC to offer on mar 20'"
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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.keys(board).map((key) => (
              <div
                className={
                  "rounded-xl shadow-xl p-4 " +
                  (key.toLowerCase() === selected[1].toLowerCase()
                    ? "bg-green-200"
                    : "bg-blue-100")
                }
              >
                <div className="flex">
                  <h1 className="text-2xl font-medium pb-4 flex-1 text-left">
                    {key}
                  </h1>
                  <h1 className="text-2xl ">{board[key].length}</h1>
                </div>

                <Droppable droppableId={key}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 gap-4"
                    >
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
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>
    </>
  );
}
