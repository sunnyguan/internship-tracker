import Chart from "react-google-charts";

export function Sankey({ board }) {
  const extract = (text) => {
    return text.split("to ")[1].split(" on")[0].toLowerCase();
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

  count(board);

  return (
    <div className="m-8">
      <div className="text-2xl font-light text-center py-4">Sankey Diagram</div>
      <div className="">
        <Chart
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
