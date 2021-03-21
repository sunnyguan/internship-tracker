import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { formatDate } from "../utils/Parser";
import "./VerticalTimeline.css";

export default function ModalView({ company, setShowModal }) {
  const process = (text) => {
    return `Moved to <span class="bg-blue-300 px-2 py-1 rounded-md shadow-md mx-1">${
      text.stage
    }</span> on <span class="bg-indigo-300 px-2 py-1 rounded-md shadow-md mx-1">${
      formatDate(text.date)
    }</span>`;
  };

  return (
    <div className="text-center mx-4">
      <button
        onClick={() => {
          setShowModal(false);
        }}
        className="m-4 bg-blue-300 px-4 py-2 rounded-xl shadow-md cursor-pointer hover:bg-blue-400 outline-none focus:outline-none"
      >
        Close Modal
      </button>
      <div className="text-4xl font-bold pt-4">{company.name}</div>
      <ol className="list-decimal list-inside p-4">
        {company.actions.map((action) => (
          <li
            className="p-1 text-sm"
            dangerouslySetInnerHTML={{ __html: process(action) }}
          ></li>
        ))}
      </ol>
      <div
        contentEditable="true"
        className="bg-indigo-200 max-w-md mx-auto text-left p-4 rounded-xl shadow-md outline-none"
      >
        Notes (Markdown support coming soon!)
      </div>
      <VerticalTimeline className="custom-line">
        {company.actions.map((action) => (
          <VerticalTimelineElement
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#111" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date={formatDate(action.date)}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          >
            <h3 className="vertical-timeline-element-title">Moved to {action.stage}</h3>
          </VerticalTimelineElement>
        ))}

        <VerticalTimelineElement
          iconStyle={{ background: "rgb(16, 204, 82)", color: "#888" }}
        />
      </VerticalTimeline>
    </div>
  );
}
