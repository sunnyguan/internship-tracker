import { useEffect, useState } from "react";

function Stats({ board }) {
  const [stats, setStats] = useState({});

  const calculateTotal = () => {
    let newStats = stats;
    newStats["Total Companies"] = Object.keys(board).length;
    if (newStats !== stats)
      setStats(newStats);
  };

  const calculateRates = () => {
    let count = 0;
    let offers = 0;
    let rejects = 0;
    Object.keys(board).forEach((key) => {
      let company = board[key];
      let hasOffer = false;
      let isReject = false;
      company.actions.forEach((action) => {
        if (action.stage.toLowerCase() === "offer") hasOffer = true;
        if (action.stage.toLowerCase() === "rejected") isReject = true;
      });
      if (hasOffer) offers++;
      if (isReject) rejects++;
      count++;
    });
    let newStats = stats;
    newStats["Offer Rate"] = (offers / count) * 100 + "%";
    newStats["Reject Rate"] = (rejects / count) * 100 + "%";
    if (newStats !== stats)
      setStats(newStats);
  };

  const getStats = () => {
    calculateTotal();
    calculateRates();
  };

  // eslint-disable-next-line
  // useEffect(getStats, [board]);
  getStats();

  return (
    <div className="p-8 bg-blue-100">
      <div className="text-center text-3xl font-light pb-8">Stats</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Object.keys(stats).map((key) => (
          <div className="text-center py-4" key={key}>
            <div className="text-xl font-semibold">{key}</div>
            <div className="text-lg">{stats[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
