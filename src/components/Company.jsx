export function Company ({ name, highlight }) {
    return (
        <div className={"text-center rounded-lg shadow-md font-light py-2 " + (highlight ? "bg-indigo-300" : "bg-white")}>
            {name}
        </div>
    )
}