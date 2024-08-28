import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 dark:bg-background-dark bg-background-light">
        <div className="flex space-x-4">
          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="w-24 h-24" alt="React logo" />
          </a>
        </div>
        <h1 className="text-3xl font-semibold dark:text-white text-gray-800 mt-8">
          Vite + React
        </h1>
        <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-button-dark">
          <button
            className="rounded-button border border-transparent px-4 py-2 text-base font-medium dark:bg-button-dark bg-button-light hover:border-primary-link focus:outline-focus"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Edit{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
              src/App.tsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>
        <p className="mt-8 text-gray-600 dark:text-gray-300">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
}

export default App;
