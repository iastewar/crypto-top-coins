import ReactECharts from "echarts-for-react";
import { useEffect } from "react";
import { getCmcData } from "./cmcChartApi";
import "./CmcChart.scss";


const CmcChart = () => {
  useEffect(() => {
    getCmcData().then((data) => console.log(data));
  }, []);

  const option = {
    xAxis: {
      data: ["2017-10-24", "2017-10-25", "2017-10-26", "2017-10-27"],
    },
    yAxis: {},
    series: [
      {
        type: "candlestick",
        data: [
          [20, 34, 10, 38],
          [40, 35, 30, 50],
          [31, 38, 33, 44],
          [38, 15, 5, 42],
        ],
      },
    ],
  };

  return (
    <div className="cmc-chart-container">
      <ReactECharts
        option={option}
        style={{ height: "500px", width: "500px" }}
      ></ReactECharts>
    </div>
  );
};

export default CmcChart;