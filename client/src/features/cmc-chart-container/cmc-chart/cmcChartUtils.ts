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
  const richImages = {};
  for (let i = 0; i < filteredCmcData.length; i++) {
    richImages["img" + i] = {
      height: 15,
      backgroundColor: {
        image: filteredCmcData[i].imgSrc,
      },
    }
  }

  return {
    xAxis: {
      max: "dataMax",
      type: "log",
      animationDuration: ANIMATION_DURATION / 10,
      animationDurationUpdate: ANIMATION_DURATION / 10,
      axisLabel: {
        formatter: (d: any) => accounting.formatMoney(toMillions(d)),
        rotate: 90,
        verticalAlign: 'top'
      }
    },
    yAxis: {
      type: "category",
      data: filteredCmcData.map((e) => `${e.name};${e.symbol}`),
      inverse: true,
      animationDuration: ANIMATION_DURATION / 10,
      animationDurationUpdate: ANIMATION_DURATION / 10,
      axisLabel: {
        formatter: (value, index) => `{img${index}|} {bold|${value.split(';')[0]}} {light|${value.split(';')[1]}}`,
        rich: {
          bold: {
            fontWeight: 700,
            color: "white"
          },
          light: {
            fontWeight: 100,
            color: "white"
          },
          ...richImages
        },
        inside: true
      },
      z: 10
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
          show: false,
          position: "right",
          valueAnimation: true,
          color: "#6e7079",
          formatter: (d: any) => accounting.formatMoney(toMillions(d.value)),
        },
        silent: true,
        itemStyle: {
          borderRadius: [0, 5, 5, 0]
        }
      },
    ],
    legend: {
      show: false,
    },
    animationDuration: 0,
    animationDurationUpdate: ANIMATION_DURATION,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
    media: [
      {
        query: {
          minWidth: 768 // desktop view
        },
        option: {
          xAxis: {
            axisLabel: {
              rotate: 0,
              verticalAlign: 'middle',
            }
          },
          yAxis: {
            axisLabel: {
              inside: false
            }
          },
          series: [
            {
              label: {
                show: true
              }
            }
          ]
        }
      }
    ]
  };
};
