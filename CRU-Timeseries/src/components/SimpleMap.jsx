import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Tooltip } from "react-tooltip";

const geoCountries = `${import.meta.env.BASE_URL}countries.json`;
const defaultCentre = [0, 20];
const defaultZoom = 1;
const maxZoomIn = 12;
const maxZoomOut = 1;

export default function SimpleMap({ country, setCountry }) {
  const [centre, setCentre] = useState(defaultCentre);
  const [zoom, setZoom] = useState(defaultZoom);

  // Find country, compute center point and set zoom level
  // TODO
  // useEffect(() => {
  //   if (country) {
  //   }
  // }, [country]);

  function handleCountryClick(geo) {
    setCountry(geo.properties.country);

    // Find the centroid of the country
    const centroid = geoCentroid(geo);
    setCentre(centroid);
    setZoom(3);
  }

  function handleResetZoom() {
    setCentre(defaultCentre);
    setZoom(defaultZoom);
  }

  function handleZoomIn() {
    setZoom((prevZoom) => {
      if (prevZoom < maxZoomIn) {
        return prevZoom + 1;
      }
      return prevZoom; // return current zoom if already at max zoom in
    });
  }

  function handleZoomOut() {
    setZoom((prevZoom) => {
      if (prevZoom > maxZoomOut) {
        return prevZoom - 1;
      }
      return prevZoom; // return current zoom if already at max zoom out
    });
  }

  return (
    <>
      <div className="flex flex-col justify-start gap-1 xl:mt-1.5">
        <Tooltip
          id="zoomInTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
          style={{ zIndex: 99 }}
        />
        <button
          onClick={handleZoomIn}
          className="font-revert cursor-pointer rounded bg-neutral-400 px-0.5 text-white select-none hover:bg-teal active:scale-95"
          data-tooltip-id="zoomInTooltip"
          data-tooltip-content="Zoom In"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "right"}`}
        >
          <AddIcon sx={{ display: "block" }} />
        </button>

        <Tooltip
          id="zoomOutTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
          style={{ zIndex: 99 }}
        />
        <button
          onClick={handleZoomOut}
          className="font-revert cursor-pointer rounded bg-neutral-400 px-0.5 text-white select-none hover:bg-teal active:scale-95"
          data-tooltip-id="zoomOutTooltip"
          data-tooltip-content="Zoom Out"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "right"}`}
        >
          <RemoveIcon sx={{ display: "block" }} />
        </button>

        <Tooltip
          id="resetMapTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
          style={{ zIndex: 99 }}
        />
        <button
          onClick={handleResetZoom}
          className="font-revert cursor-pointer rounded bg-neutral-400 px-0.5 text-white select-none hover:bg-teal active:scale-95"
          data-tooltip-id="resetMapTooltip"
          data-tooltip-content="Reset Map View"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "right"}`}
        >
          <ZoomOutMapIcon sx={{ display: "block" }} />
        </button>
      </div>

      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        viewBox="0 160 800 400"
        className="h-40 w-full cursor-grab px-1 md:h-50 xl:h-full xl:self-center"
      >
        <ZoomableGroup
          zoom={zoom}
          center={centre}
          onMoveEnd={({ zoom, coordinates }) => {
            setZoom(zoom);
            setCentre(coordinates);
          }}
        >
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#9999" strokeWidth={0.5} />
          <Geographies geography={geoCountries}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isActive = geo.properties.country === country;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    fill={isActive ? "var(--color-teal)" : "#E0E0E0"}
                    stroke="#555"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: isActive
                        ? { outline: "none", cursor: "pointer" } // disable hover styling
                        : {
                            outline: "none",
                            cursor: "pointer",
                            fill: "#BDBDBD",
                          },
                      pressed: isActive
                        ? { outline: "none" } // disable pressed styling
                        : { fill: "var(--color-blue-400)", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
}
