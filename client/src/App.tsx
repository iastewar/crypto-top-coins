import "./App.scss";
import CmcChartContainer from "./features/cmc-chart-container/CmcChartContainer";

const App = () => {
  return (
    <div className="main-container">
      <h3>Top Coins Over Time</h3>
      <h6>Market Cap ($M)</h6>
      <CmcChartContainer />
    </div>
  );
};

export default App;
