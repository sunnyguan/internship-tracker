import Chart from "react-google-charts";

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

export function Sankey({ board }) {
  const extract = (text) => {
    return text.stage.toLowerCase();
  };

  const order = {
    applied: 0,
    oa: 1,
    phone: 2,
    final: 3,
    offer: 4,
    rejected: 4,
  };

  const count = (board) => {
    let counter = {};
    Object.keys(board).forEach((key) => {
      board[key].forEach((company) => {
        let actions = company.actions;
        for (let i = 0; i < actions.length - 1; ++i) {
          let curr = extract(actions[i + 1]);
          let last = extract(actions[i]);
          if (order[curr] <= order[last]) continue;
          let key = last + "," + curr;
          if (!(key in counter)) counter[key] = 0;
          counter[key]++;
        }
      });
    });

    let result = [["From", "To", "Count"]];
    Object.keys(counter).forEach((key) => {
      let split = key.split(",");
      result.push([split[0], split[1], counter[key]]);
    });
    return result;
  };

  return (
    <div className="p-8 bg-blue-100">
      <div className="text-3xl font-light text-center py-4">Sankey Diagram</div>
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
