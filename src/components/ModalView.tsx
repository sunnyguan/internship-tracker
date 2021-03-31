import { useEffect, useState } from "react";
import Modal from "react-modal";

type Props = {
  selection: { company: string; stage: string };
  showModal: boolean;
  updateNote: (note: string) => void;
  closeModal: () => void;
  initial: string;
};

function ModalView({
  selection,
  showModal,
  updateNote,
  closeModal,
  initial,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(initial);
  }, [initial, selection]);

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const exit = () => {
    updateNote(inputValue);
    // setInputValue("");
    closeModal();
  };

  const handleKeyUp = (e: any) => {
    if (e.key === "Enter") {
      // exit();
    }
  };
  return (
    <Modal isOpen={showModal} ariaHideApp={false}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex font-light text-3xl pb-4">
          <span className="flex-1">
            Notes
          </span>
          <span className="">
            {selection.company + " - " + selection.stage}
          </span>
        </div>
        <textarea
          className="resize-none ring-blue-200 mb-2 flex-1 px-4 rounded-lg placeholder-gray-400 text-gray-900 inline-block shadow-md focus:outline-none ring-2 focus:ring-blue-600 w-full bg-white text-center"
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          value={inputValue}
          placeholder="Take notes here"
        />
        <button className="btn flex mx-auto mt-4" onClick={exit}>
          Save and Exit
        </button>
      </div>
    </Modal>
  );
}

export default ModalView;
