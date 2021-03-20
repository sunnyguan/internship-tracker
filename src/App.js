import "./App.css";
import { Container } from "./components/Container";

function App() {
  return (
    <div className="text-red-500">
      <div className="header bg-blue-100 p-8">
        <input
          className="ring-blue-200 mr-4 py-2 px-4 rounded-lg placeholder-gray-400 text-gray-900 inline-block shadow-md focus:outline-none ring-2 focus:ring-blue-600 w-full text-center"
          placeholder="Enter updates here..."
        />
      </div>
      <div className="body bg-green-100">
        <Container />
      </div>
    </div>
  );
}

export default App;
