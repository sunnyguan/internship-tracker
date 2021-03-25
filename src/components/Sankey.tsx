import Chart from "react-google-charts";
import { boardType } from "../types/board";

const colors = [
  "#a6cee3",
  "#b2df8a",
  "#fb9a99",
  "#fdbf6f",
  "#cab2d6",
  "#ffff99",
  "#1f78b4",
  "#33a02c",
];

type Props = {
  board: boardType
}

type counterType = {
  [key: string]: number
}

type sankeyType = Array<[string, string, string | number]>;

export function Sankey({ board }: Props) {
  if (Object.keys(board).length === 0) {
    return <div className="text-xl font-light text-center">Empty Sankey</div>;
  }
  const extract = (text: { stage: string; }) => {
    return text.stage.toLowerCase();
  };

  const count = (board: boardType) => {
    let counter: counterType = {};
    Object.keys(board).forEach((key) => {
      let company = board[key];
      let actions = company.actions;
      for (let i = 0; i < actions.length - 1; ++i) {
        let curr = extract(actions[i + 1]);
        let last = extract(actions[i]);
        let key = last + "," + curr;
        if (!(key in counter)) counter[key] = 0;
        counter[key]++;
      }
    });

    let result: sankeyType = [["From", "To", "Count"]];
    Object.keys(counter).forEach((key) => {
      let split = key.split(",");
      result.push([split[0], split[1], counter[key]]);
    });
    return result;
  };

  return (
    <div className="p-8 bg-blue-100">
      <div className="">
        <Chart
          options={{
            sankey: {
              node: {
                colors: colors,
              },
              link: {
                colorMode: "gradient",
                colors: colors,
              },
            },
          }}
          height={"500px"}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={count(board)}
          className="h-full"
        />
      </div>
    </div>
  );
}
