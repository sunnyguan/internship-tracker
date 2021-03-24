import React, { useState } from "react";
import { process } from "../utils/Parser";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";

type Props = {
  updateBoard: (board: any) => void,
  board: any
}

function CommandInput({ updateBoard, board }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e: string) => {
    if (!e.endsWith("\n")) setInputValue(e);
  };

  const handleKeyUp = (e: {key: string}) => {
    let text = inputValue.replaceAll("@", "");
    let enter = e.key === "Enter";
    let [newBoard, newInfo, resetFlag] = process(text, enter, board);
    if (resetFlag === 2) updateBoard(newBoard);
    setInfo(newInfo);
    if (resetFlag === 2) {
      setInputValue("");
      setInfo("");
    }
  };

  return (
    <div className="px-8 header text-center">
      <TextInput
        className="mt-4 resize-none ring-blue-200 mr-4 pt-1 h-8 px-4 rounded-lg placeholder-gray-400 text-gray-900 inline-block shadow-md focus:outline-none ring-2 focus:ring-blue-600 w-full bg-white text-center"
        placeholder='Try "move IMC to offer two weeks ago"'
        onKeyUp={handleKeyUp}
        onChange={handleChange}
        value={inputValue}
        offsetX={16}
        offsetY={20}
        options={Object.keys(board)}
      />
      <div className="p-4" dangerouslySetInnerHTML={{ __html: info }}></div>
    </div>
  );
}

export default CommandInput;
