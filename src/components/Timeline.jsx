import Chart from "react-google-charts";

function Timeline({ board }) {
  if (!board) {
    return (
      <div className="text-center text-xl font-light">Loading Timeline</div>
    );
  }
  const getData = () => {
    let data = [];
    Object.keys(board).forEach((key) => {
      board[key].forEach((company) => {
        let actions = company.actions;
        for (let i = 0; i < actions.length - 1; ++i) {
          let date1 = new Date(actions[i].date);
          let date2 = new Date(actions[i + 1].date);
          if (date1 <= date2) {
            data.push([
              company.name,
              actions[i].stage,
              new Date(actions[i].date),
              new Date(actions[i + 1].date),
            ]);
          }
        }
        if (actions.length >= 1) {
          let id = actions.length - 1;
          let lastDate = new Date(actions[id].date);
          if (lastDate <= new Date()) {
            data.push([
              company.name,
              actions[id].stage,
              new Date(actions[id].date),
              new Date(),
            ]);
          }
        }
      });
    });

    data.sort((o1, o2) => {
      return o1[2] - o2[2];
    });
    data.unshift([
      { type: "string", id: "Position" },
      { type: "string", id: "Name" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ]);
    return data;
  };
  return (
    <div className="p-8 bg-blue-100">
      <div className="text-3xl font-light text-center p-4">Timeline</div>
      <Chart
        width={"100%"}
        height={"500px"}
        chartType="Timeline"
        loader={<div>Loading Chart</div>}
        data={getData(board)}
        rootProps={{ "data-testid": "3" }}
      />
    </div>
  );
}

export default Timeline;
