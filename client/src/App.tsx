import "./App.scss";
import CmcChart from "./features/cmc-chart/CmcChart";

const App = () => {
  return (
    <div className="main-container">
      <h3>Top Coins Over Time</h3>
      <h6>Market Cap ($M)</h6>
      <CmcChart />
    </div>
  );
};

export default App;
