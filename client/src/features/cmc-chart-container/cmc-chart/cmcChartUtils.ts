import dayjs from "dayjs";
import { CmcData } from "../cmcChartContainerApi";
import accounting from "accounting-js";

export const ANIMATION_DURATION = 1000; // ms

export const toMillions = (n: number) => {
  return n / 10 ** 6;
};

export const getDates = (cmcData: CmcData[]) => {
  let dates = cmcData.map((e) => ({
    year: e.year,
    month: e.month,
    day: e.day,
  }));
  const dateSet = new Set(dates.map((e) => `${e.year}-${e.month}-${e.day}`));
  dates = Array.from(dateSet).map((e) => ({
    year: parseInt(e.split("-")[0]),
    month: parseInt(e.split("-")[1]),
    day: parseInt(e.split("-")[2]),
  }));

  return dates;
};

export const getCurrentDate = (cmcData: CmcData[], dateIndex: number) => {
  const dates = getDates(cmcData);

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

export const getFilteredCmcData = (cmcData: CmcData[], dateIndex: number) => {
  const dates = getDates(cmcData);

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
      e.year === dates[index].year &&
      e.month === dates[index].month &&
      e.day === dates[index].day
  );

  return data;
};

export const getOption = (cmcData: CmcData[], dateIndex: number) => {
  const filteredCmcData = getFilteredCmcData(cmcData, dateIndex);

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
      containLabel: true,
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
