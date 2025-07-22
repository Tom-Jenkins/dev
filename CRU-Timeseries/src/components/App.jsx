import { useState, useEffect } from "react";
import Select from "react-select";
import ECharts from "./ECharts";
import SimpleMap from "./SimpleMap";
import { Tooltip } from "react-tooltip";

export default function App() {
  const [data, setData] = useState(null);
  const [variable, setVariable] = useState("cld");
  const [country, setCountry] = useState("United Kingdom");
  const [season, setSeason] = useState("Annual");
  const [echartsData, setEchartsData] = useState(null);

  // Parse json data from public folder once on first render with useEffect hook
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}CRU-7Var.json`)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        // console.log(json);
      });
  }, []);

  // Update ECharts data when variable or country select changes
  useEffect(() => {
    if (data && variable && country) {
      // console.log(variable, country);
      setEchartsData(data[variable].data[country]);
    }
  }, [data, variable, country]);

  // Guard clause if no data is parsed
  if (!data) return null;

  // Variable select options (e.g. Near-Surface Temperature)
  const variablesArray = Object.keys(data); // short names (e.g. cld)
  const variablesInput = variablesArray.map((i) => ({
    value: i,
    label: data[i].meta["Variable-long-name"],
  }));

  // Country select options (e.g. United Kingdom)
  const countriesArray = Object.keys(data[variablesArray[0]].data);
  const countriesInput = countriesArray.map((i) => ({
    value: i,
    label: i,
  }));

  // Default values in select options
  const defaultVariable = variablesInput.find((i) => i.value === variable);
  const defaultCountry = countriesInput.find((i) => i.value === country);

  // Update state each time a new variable is selected
  function handleVariable(option) {
    if (option) {
      setVariable(option.value);
    }
  }

  // Update state each time a new country is selected
  function handleCountry(option) {
    if (option) {
      setCountry(option.value);
    }
  }

  // Update state each time a new season button is clicked
  function handleSeason(e) {
    setSeason(e.target.value);
  }

  return (
    <div className="p-2">
      <div className="text-xlg mb-2 rounded-sm bg-neutral-100 p-2">
        <div className="mb-2 text-2xl">
          Country Averages for Climate Data 1901—2024
        </div>
        <div className="text-md">Climate Research Unit</div>
      </div>

      <div className="mb-2 w-full sm:flex sm:gap-2">
        <div className="w-full">
          <span className="hidden rounded-t-sm bg-neutral-200 p-2 font-bold sm:block">
            Variable
          </span>
          <Select
            options={variablesInput}
            value={defaultVariable}
            onChange={handleVariable}
            // isClearable={true}
            placeholder={"Select variable ..."}
            className="z-20 capitalize"
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary: "var(--color-teal)",
                primary25: "var(--color-teal-50)",
                primary50: "var(--color-teal-100)",
              },
            })}
            styles={{
              control: (base) => ({
                ...base,
                cursor: "pointer",
                "@media (min-width: 640px)": {
                  // Tailwind's 'sm' breakpoint is 640px
                  borderTopLeftRadius: "0",
                  borderTopRightRadius: "0",
                },
              }),
              // option: (base) => ({
              //   ...base,
              //   cursor: "pointer",
              // }),
            }}
          />
        </div>

        <div className="w-full">
          <span className="hidden rounded-t-sm bg-neutral-200 p-2 font-bold sm:block">
            Country
          </span>
          <Select
            options={countriesInput}
            value={defaultCountry}
            onChange={handleCountry}
            // isClearable={true}
            isSearchable={true}
            placeholder={"Select country ..."}
            className="z-10 capitalize"
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary: "var(--color-teal)",
                primary25: "var(--color-teal-50)",
                primary50: "var(--color-teal-100)",
              },
            })}
            styles={{
              control: (base) => ({
                ...base,
                cursor: "pointer",
                "@media (min-width: 640px)": {
                  // Tailwind's 'sm' breakpoint is 640px
                  borderTopLeftRadius: "0",
                  borderTopRightRadius: "0",
                },
              }),
              // option: (base) => ({
              //   ...base,
              //   cursor: "pointer",
              // }),
            }}
          />
        </div>
      </div>

      <div className="xl:inline-flex xl:h-120 xl:w-full xl:flex-row-reverse xl:gap-2">
        <div className="mb-2 flex justify-center rounded-sm bg-neutral-50 p-1 xl:h-full xl:w-[50%]">
          <SimpleMap country={country} setCountry={setCountry} />

          <div className="flex w-15 flex-col justify-start gap-1 text-center xl:mt-1.5">
            <Tooltip
              id="annualTooltip"
              className="hidden px-1.5! py-0.5! sm:block"
            />
            <button
              value="Annual"
              onClick={handleSeason}
              className={`cursor-pointer rounded px-1 text-white select-none active:scale-95 ${season === "Annual" ? "bg-teal" : "bg-neutral-400 hover:bg-teal"}`}
              data-tooltip-id="annualTooltip"
              data-tooltip-content="Annual Means"
            >
              Annual
            </button>

            <Tooltip
              id="DJFTooltip"
              className="hidden px-1.5! py-0.5! sm:block"
            />
            <button
              value="DJF"
              onClick={handleSeason}
              className={`cursor-pointer rounded px-1 text-white select-none active:scale-95 ${season === "DJF" ? "bg-teal" : "bg-neutral-400 hover:bg-teal"}`}
              data-tooltip-id="DJFTooltip"
              data-tooltip-content="Dec-Jan-Feb Means"
            >
              DJF
            </button>

            <Tooltip
              id="MAMTooltip"
              className="hidden px-1.5! py-0.5! sm:block"
            />
            <button
              value="MAM"
              onClick={handleSeason}
              className={`cursor-pointer rounded px-1 text-white select-none active:scale-95 ${season === "MAM" ? "bg-teal" : "bg-neutral-400 hover:bg-teal"}`}
              data-tooltip-id="MAMTooltip"
              data-tooltip-content="Mar-Apr-May Means"
            >
              MAM
            </button>

            <Tooltip
              id="JJATooltip"
              className="hidden px-1.5! py-0.5! sm:block"
            />
            <button
              value="JJA"
              onClick={handleSeason}
              className={`cursor-pointer rounded px-1 text-white select-none active:scale-95 ${season === "JJA" ? "bg-teal" : "bg-neutral-400 hover:bg-teal"}`}
              data-tooltip-id="JJATooltip"
              data-tooltip-content="Jun-Jul-Aug Means"
            >
              JJA
            </button>

            <Tooltip
              id="MAMTooltip"
              className="hidden px-1.5! py-0.5! sm:block"
            />
            <button
              value="SON"
              onClick={handleSeason}
              className={`cursor-pointer rounded px-1 text-white select-none active:scale-95 ${season === "SON" ? "bg-teal" : "bg-neutral-400 hover:bg-teal"}`}
              data-tooltip-id="MAMTooltip"
              data-tooltip-content="Sep-Oct-Nov Means"
            >
              SON
            </button>
          </div>
        </div>

        <div className="relative h-100 rounded-sm bg-neutral-50 p-1 xl:h-full xl:w-[50%]">
          {echartsData ? ( // Show chart if data is available
            <ECharts
              data={echartsData}
              variable={data[variable].meta["Variable-long-name"]}
              country={country}
              season={season}
            />
          ) : (
            // Show "No Data"
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-neutral-600 sm:text-2xl">
              {`No Data For ${country}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
