export function Company({ company, highlight }) {
  return (
    <div
      className={
        "text-center rounded-lg shadow-md font-light py-2 " +
        (highlight ? "bg-indigo-300" : "bg-white")
      }
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
