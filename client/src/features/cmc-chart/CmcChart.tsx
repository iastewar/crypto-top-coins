import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { CmcData, getCmcData } from "./cmcChartApi";
import "./CmcChart.scss";
import { Button, Form, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import accounting from "accounting-js";

const ANIMATION_DURATION = 3000;

const toMillions = (n: number) => {
  return n / 10 ** 6;
};

const CmcChart = () => {
  const [cmcData, setCmcdata] = useState([] as CmcData[]);
  const [dateIndex, setDateIndex] = useState(0);
  const [playInterval, setPlayInterval] = useState(undefined as NodeJS.Timeout);

  const getFilteredCmcData = () => {
    const dates = getOrderedDates();

    let data: CmcData[] = [];

    if (dates.length === 0) {
      return data;
    }

    let index = dateIndex;
    if (dateIndex >= dates.length) {
      index = dates.length - 1;
    }

    data = cmcData.filter(
      (e) =>
        e.year === dates[index].year && e.month === dates[index].month
    );

    return data;
  }

  const getOrderedDates = () => {
    let dates = cmcData.map((e) => ({ year: e.year, month: e.month }));
    const dateSet = new Set(dates.map((e) => `${e.year}-${e.month}`));
    dates = Array.from(dateSet).map((e) => ({
      year: parseInt(e.split("-")[0]),
      month: parseInt(e.split("-")[1]),
    }));
    dates.sort((a, b) => a.year * 100 + b.month);

    return dates;
  }

  const getCurrentDate = () => {
    const dates = getOrderedDates();
  
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
    getCmcData()
      .then((data) => setCmcdata(data))
      .then(() => handlePlayPauseClick());

    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateIndex(parseInt(e.target.value));
  }

  const handlePlayPauseClick = (play = true) => {
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(undefined);
    }

    if (!play) {
      return;
    }

    const run = () => {
      setDateIndex(i => i + 1);
    };

    setTimeout(() => {
      run();
    }, 0);

    // change month every ANIMATION_DURATION
    const interval = setInterval(() => {
      run();
    }, ANIMATION_DURATION);

    setPlayInterval(interval);
  }

  const getOption = () => {
    const filteredCmcData = getFilteredCmcData();

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
      grid: {
        left: 0,
        containLabel: true
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

      <Form.Label>{getCurrentDate()}</Form.Label>
      <Form.Range value={dateIndex} onChange={handleRangeChange} min="0" max={getOrderedDates().length - 1} step="1" />
      <Button variant="dark" onClick={() => handlePlayPauseClick(!playInterval)}>{playInterval ? 'Pause' : 'Play'}</Button>
    </>
  );
};

export default CmcChart;
