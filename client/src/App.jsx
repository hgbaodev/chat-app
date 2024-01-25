import { useId } from "react";

function App() {
  const vegetableSelectId = useId();
  return (
    <>
      <h1 className="text-red-100 text-center p-10 bg-slate-600 rounded-md">hgbaodev</h1>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>Pick a vegetable:</label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}

export default App;
