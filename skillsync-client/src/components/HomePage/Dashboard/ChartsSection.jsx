import React, { useEffect, useState } from "react";
import { GetJobsCount } from "../../../supabase/JobApplicationTracker";
import ApexCharts from "apexcharts";
import { GetJobPreferences } from "../../../supabase/JobPreferences";
import { GetProfileInfo } from "../../../supabase/ProfileInfo";

const bufferOffset = 2; // 10% buffer so that bars with 0% are still visible

const ChartsSection = () => {
  const [conversionRate, setConversionRate] = React.useState(0);
  const [interviewRate, setInterviewRate] = React.useState(0);
  const [profileBuildingCompletion, setProfileBuildingCompletion] =
    React.useState(0);
  const [fetched, setFetched] = React.useState(false);

  useEffect(() => {
    async function fetchStats() {
      const totalAppliedCount = await GetJobsCount([
        "applied",
        "interviewing",
        "testing",
        "offer",
      ]);
      const totalInterviewingCount = await GetJobsCount([
        "interviewing",
        "offer",
      ]);
      const totalOfferedCount = await GetJobsCount(["offer"]);
      console.log("Total applied count: ", totalAppliedCount);
      console.log("Total interviewing count: ", totalInterviewingCount);
      console.log("Total offered count: ", totalOfferedCount);
      const conversionRate = !totalAppliedCount ? 0 : (totalOfferedCount / totalAppliedCount) * 100;
      const interviewRate = !totalAppliedCount ? 0 : (totalInterviewingCount / totalAppliedCount) * 100;
      console.log("Interview rate: ", interviewRate);
      console.log("Conversion rate: ", conversionRate);

      // Fetch Profile Building stats
      let profileBuildingCompletion = 0;
      // Todo: Make better
      if (await GetJobPreferences()) {
        profileBuildingCompletion += 50;
      }
      const profileInfo = await GetProfileInfo(
        `name, school, grad_year, program, specialization, industry, linkedin, github`
      );
      console.log(profileInfo);
      // Assign proportion of 50 for each field
      const requiredFields = [
        profileInfo.name,
        profileInfo.school,
        profileInfo.grad_year,
        profileInfo.program,
        profileInfo.specialization,
        profileInfo.industry,
        profileInfo.linkedin,
      ];
      profileBuildingCompletion += (() => {
        let completion = 0;
        for (let field of requiredFields) {
          if (field) {
            completion += 50 / requiredFields.length;
          }
        }
        return completion;
      })();

      try {
        setConversionRate(conversionRate);
        setInterviewRate(interviewRate);
        setProfileBuildingCompletion(profileBuildingCompletion);
        setFetched(true);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStats();
  }, []);

  const getChartOptions = () => {
    return {
      series: [
        interviewRate + bufferOffset,
        conversionRate + bufferOffset,
        profileBuildingCompletion + bufferOffset,
      ],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
      chart: {
        height: "250px",
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
            background: "#1e1e1e",
            strokeWidth: "97%",
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
        },
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
      labels: ["Interview Rate", "Conversion Rate", "Profile Building"],
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
        y: {
          formatter: function (val) {
            return `${(val - bufferOffset).toFixed(0)}%`;
          },
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
        console.log("Rendering chart");
        document.querySelector("#radial-chart").innerHTML = "";
        chart.render();
      }
    }
  }, [fetched]);

  return (
    <div className="w-[40%] h-72">
      <div className="h-72 ml-3 w-full rounded-lg shadow bg-[#1e1e1e] !p-5 md:p-6">
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

        <div className="" id="radial-chart"></div>
      </div>
    </div>
  );
};
export default ChartsSection;
