import React, { useState } from "react";
function CommandInput({ highlighter }) {
  const [inputValue, setInputValue] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyUp = (e) => {
    let [info, flag] = highlighter(e);
    if (flag !== 1) setInfo(info);
    if (flag === 2) {
      setInputValue("");
      setInfo("");
    }
  };

  return (
    <div className="px-8 header text-center mb-4">
      <input
        className="mt-4 ring-blue-200 mr-4 py-2 px-4 rounded-lg placeholder-gray-400 text-gray-900 inline-block shadow-md focus:outline-none ring-2 focus:ring-blue-600 w-full bg-white text-center"
        placeholder='Try "move IMC to offer two weeks ago"'
        onKeyUp={handleKeyUp}
        onChange={handleChange}
        value={inputValue}
      />
      <div
        className="p-4 h-16"
        dangerouslySetInnerHTML={{ __html: info }}
      ></div>
    </div>
  );
}

export default CommandInput;
