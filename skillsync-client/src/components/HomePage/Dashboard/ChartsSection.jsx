import React, { useEffect, useState } from "react";
import { GetJobsCount } from "../../../supabase/JobApplicationTracker";
import ApexCharts from "apexcharts";

const ChartsSection = () => {
  const [conversionRate, setConversionRate] = React.useState(0);
  const [fetched, setFetched] = React.useState(false);


  useEffect(() => {
    async function fetchStats() {
      const totalAppliedCount = await GetJobsCount(["applied", "interviewing", "testing", "offer"])
      const totalOfferedCount = await GetJobsCount(["offer"])
      console.log("Total applied count: ", totalAppliedCount)
      console.log("Total offered count: ", totalOfferedCount)
      const conversionRate = totalOfferedCount/totalAppliedCount*100
      console.log("Conversion rate: ", conversionRate)
      try {
        setConversionRate(conversionRate);
        setFetched(true);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStats();
  }, []);


  const getChartOptions = () => {
    return {
      series: [90, conversionRate, 70],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
      chart: {
        height: "260px",
        width: "100%",
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          track: {
            show: true,
            background: '#1e1e1e',
            strokeWidth: '97%',
            opacity: 1,
            margin: 5, // margin is in pixels
          },
          dataLabels: {
            show: false,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
          },
          hollow: {
            margin: 0,
            size: "32%",
          },
          cornerRadius: 20,
          borderRadius: 30,

        },
        bar: {
          borderRadius: 30,
        }
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -23,
          bottom: -20,
        },
      },
      labels: ["Industry Rating", "Conversion Rate", "Overall Competency"],
      legend: {
        show: true,
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
    };
  };

  useEffect(() => {
    if (fetched) {
      if (
        document.getElementById("radial-chart") &&
        typeof ApexCharts !== "undefined"
      ) {
        const chart = new ApexCharts(
          document.querySelector("#radial-chart"),
          getChartOptions()
        );
        console.log("Rendering chart")
        document.querySelector("#radial-chart").innerHTML = "";
        chart.render();
      }
    }
  }, [fetched]);

  return (
    <div>
      <div className="max-w-sm h-full ml-3 w-full rounded-lg shadow bg-[#1e1e1e] p-4 md:p-6">

        <div className="flex !text-white justify-between mb-3">
          <div className="flex items-center">
            <div className="flex justify-center items-center">
              <h5 className="text-xl font-bold leading-none text-white pe-1">
                Your stats
              </h5>
              <svg
                data-popover-target="chart-info"
                data-popover-placement="bottom"
                className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
              </svg>
              <div
                data-popover
                id="chart-info"
                role="tooltip"
                className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
              >
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Activity growth - Incremental
                  </h3>
                  <p>
                    Report helps navigate cumulative growth of community
                    activities. Ideally, the chart should have a growing trend,
                    as stagnating chart signifies a significant decrease of
                    community activity.
                  </p>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Calculation
                  </h3>
                  <p>
                    For each date bucket, the all-time volume of activities is
                    calculated. This means that activities in period n contain
                    all activities up to period n, plus the activities generated
                    by your community in period.
                  </p>
                  <a
                    href="#"
                    className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Read more{" "}
                    <svg
                      className="w-2 h-2 ms-1.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </a>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-64" id="radial-chart"></div>

      </div>
    </div>
  );
};
export default ChartsSection;
