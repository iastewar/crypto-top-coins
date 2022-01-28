import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { CmcData, getCmcData } from "./cmcChartApi";
import "./CmcChart.scss";
import { Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import accounting from "accounting-js";

const ANIMATION_DURATION = 1000;

const toMillions = (n: number) => {
  return n / 10 ** 6;
};

const CmcChart = () => {
  const [cmcData, setCmcdata] = useState([] as CmcData[]);
  const [filteredCmcData, setFilteredCmcData] = useState([] as CmcData[]);
  const [dates, setDates] = useState([] as { year: number; month: number }[]);
  const [dateIndex, setDateIndex] = useState(0);

  const getCurrentDate = () => {
    if (dates.length === 0) {
      return "";
    }

    let index = dateIndex;
    if (dateIndex >= dates.length) {
      index = dates.length - 1;
    }

    const currentDate = dates[index];
    return dayjs()
      .year(currentDate.year)
      .month(currentDate.month - 1)
      .format("MMMM YYYY");
  };

  // cmc data
  useEffect(() => {
    let interval: NodeJS.Timeout;

    getCmcData()
      .then((data) => setCmcdata(data))
      .then(() => {
        let i = dateIndex;

        const run = () => {
          i++;
          setDateIndex(i);
        };

        setTimeout(() => {
          run();
        }, 0);

        // change month every ANIMATION_DURATION
        interval = setInterval(() => {
          run();
        }, ANIMATION_DURATION);
      });

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // dates
  useEffect(() => {
    let dates = cmcData.map((e) => ({ year: e.year, month: e.month }));
    const dateSet = new Set(dates.map((e) => `${e.year}-${e.month}`));
    dates = Array.from(dateSet).map((e) => ({
      year: parseInt(e.split("-")[0]),
      month: parseInt(e.split("-")[1]),
    }));
    dates.sort((a, b) => a.year * 100 + b.month);
    setDates(dates);
  }, [cmcData]);

  // filtered cmc data
  useEffect(() => {
    if (dates.length > 0 && dateIndex < dates.length) {
      const data = cmcData.filter(
        (e) =>
          e.year === dates[dateIndex].year && e.month === dates[dateIndex].month
      );
      setFilteredCmcData(data);
    }
  }, [dateIndex, cmcData, dates]);

  const getOption = () => {
    return {
      xAxis: {
        max: "dataMax",
        type: "log",
        axisLabel: {
          formatter: (d: any) => accounting.formatMoney(toMillions(d)),
        },
      },
      yAxis: {
        type: "category",
        data: filteredCmcData.map((e) => `${e.name} (${e.symbol})`),
        inverse: true,
        animationDuration: ANIMATION_DURATION / 10,
        animationDurationUpdate: ANIMATION_DURATION / 10,
      },
      series: [
        {
          realtimeSort: true,
          name: "Market Cap ($M)",
          type: "bar",
          data: filteredCmcData.map((e) => ({
            value: e.marketCap,
            itemStyle: { color: "#009FFF" }, // TODO: have a different color for every coin
          })),
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
            formatter: (d: any) => accounting.formatMoney(toMillions(d.value)),
          },
        },
      ],
      legend: {
        show: false,
      },
      animationDuration: 0,
      animationDurationUpdate: ANIMATION_DURATION,
      animationEasing: "linear",
      animationEasingUpdate: "linear",
    };
  };

  if (cmcData.length === 0) {
    return (
      <div className="loading-spinner-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <ReactECharts
        option={getOption()}
        style={{ height: "600px" }}
      ></ReactECharts>
      <div>{getCurrentDate()}</div>
    </>
  );
};

export default CmcChart;
