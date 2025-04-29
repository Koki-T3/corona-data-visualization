import LineChartSection from "./components/line-chart-section";
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
import CalendarSection from "./components/calendar-section";
import PieChartSection from "./components/pie-chart-section";
import { Button } from "./components/ui/button";

const Navigation = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed z-50">
      <ul className="flex container gap-x-5 py-3">
        <li>
          <Button variant="link" onClick={() => handleClick("/")}>
            Calendar
          </Button>
        </li>
        <li>
          <Button variant="link" onClick={() => handleClick("/task2")}>
            Line graph
          </Button>
        </li>
        <li>
          <Button variant="link" onClick={() => handleClick("/task3")}>
            Pie chart
          </Button>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<CalendarSection />} />
          <Route path="/task2" element={<LineChartSection />} />
          <Route path="/task3" element={<PieChartSection />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
