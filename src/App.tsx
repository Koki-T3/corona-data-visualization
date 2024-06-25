import LineChartSection from "./components/line-chart-section";
import { Route, Link, Routes } from "react-router-dom";
import CalendarSection from "./components/calendar-section";

const Navigation = () => {
  return (
    <nav className="fixed z-50">
      <ul className="flex container gap-x-5 py-3">
        <li>
          <Link to="/">課題1</Link>
        </li>
        <li>
          <Link to="/task2">課題2</Link>
        </li>
        <li>
          <Link to="/task3">課題3</Link>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" index element={<CalendarSection />} />
        <Route path="/task2" index element={<LineChartSection />} />
      </Routes>
    </>
  );
}

export default App;
