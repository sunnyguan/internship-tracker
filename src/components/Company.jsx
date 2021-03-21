export function Company({ company, highlight, click }) {
  return (
    <div
      className={
        "text-center cursor-pointer rounded-lg shadow-md font-light py-2 " +
        (highlight ? "bg-indigo-300 hover:bg-indigo-400" : "bg-white hover:bg-gray-200")
      }
      onClick={click}
    >
      <div className="text-lg font-medium">{company.name}</div>
      <div className="text-sm">
        {company.actions.map((action) => (
          <p>{action}</p>
        ))}
      </div>
    </div>
  );
}
