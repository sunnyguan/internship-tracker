import Chart from "react-google-charts";

function Timeline({ board }) {
  if (!board) {
    return (
      <div className="text-center text-xl font-light">Loading Timeline</div>
    );
  }
  const getData = () => {
    let data = [
      [
        { type: "string", id: "Position" },
        { type: "string", id: "Name" },
        { type: "date", id: "Start" },
        { type: "date", id: "End" },
      ],
    ];
    Object.keys(board).forEach((key) => {
      board[key].forEach((company) => {
        let actions = company.actions;
        for (let i = 0; i < actions.length - 1; ++i) {
          data.push([
            company.name,
            actions[i].stage,
            new Date(actions[i].date),
            new Date(actions[i + 1].date),
          ]);
        }
        if (actions.length >= 1) {
          let id = actions.length - 1;
          data.push([
            company.name,
            actions[id].stage,
            new Date(actions[id].date),
            new Date(),
          ]);
        }
      });
    });
    return data;
  };

  return (
    <div className="m-8">
      <div className="text-2xl font-light text-center p-4">Timeline</div>
      <Chart
        width={"100%"}
        height={"400px"}
        chartType="Timeline"
        loader={<div>Loading Chart</div>}
        data={getData()}
        rootProps={{ "data-testid": "3" }}
      />
    </div>
  );
}

export default Timeline;
