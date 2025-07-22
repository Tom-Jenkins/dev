import React from "react";
import ReactECharts from "echarts-for-react";
import option from "./EChartsOptions";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ImageIcon from "@mui/icons-material/Image";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Tooltip } from "react-tooltip";
import { useState, useRef } from "react";

export default function ECharts({ data, variable, country, season }) {
  // Guard clause if no data is parsed
  if (!data) return null;

  // Open or Closed state
  const [openModal, setModalOpen] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [openInfoTooltip, setOpenInfoTooltip] = useState(false);
  const [openDownloadTooltip, setOpenDownloadTooltip] = useState(false);
  const [openImageTooltip, setOpenImageTooltip] = useState(false);

  function handleOpenModal() {
    setModalOpen(true);
    setOpenInfoTooltip(false);
  }

  function handleCloseModal() {
    setModalOpen(false);
  }

  function handleOpenDownload() {
    setOpenDownload(true);
    setOpenDownloadTooltip(false);
  }

  function handleCloseDownload() {
    setOpenDownload(false);
  }

  function handleOpenImage() {
    setOpenImage(true);
    setOpenImageTooltip(false);
  }

  function handleCloseImage() {
    setOpenImage(false);
  }

  // Create a reference to ECharts component
  const echartsRef = useRef(null);

  // Prepare series data
  const years = data.map((item) => item.Year);
  const seasonData = data
    .map((item) => item[season])
    .map((item) => (item ? item : "No Data")); // convert null to "No Data"

  // Reset chart
  function handleResetChart() {
    if (echartsRef.current) {
      const echartsInstance = echartsRef.current.getEchartsInstance();
      if (echartsInstance) {
        echartsInstance.dispatchAction({
          type: "restore",
        });
      }
    }
  }

  // Save image as PNG or JPEG
  function handleSaveImage(filetype = "png") {
    if (echartsRef.current) {
      const echartsInstance = echartsRef.current.getEchartsInstance();
      if (echartsInstance) {
        // Get the image data URL
        const imgDataUrl = echartsInstance.getDataURL({
          type: filetype, // "png" or "jpeg"
          pixelRatio: 5, // increase pixel ratio for better quality
          backgroundColor: "#fff", // white transparent background
        });

        // Create a temporary link element to trigger the download
        const a = document.createElement("a");
        a.href = imgDataUrl;
        a.download = `CRU_image.${filetype}`; // set default filename
        document.body.appendChild(a); // append to body to make it clickable
        a.click(); // programmatically click the link
        document.body.removeChild(a); // clean up the temporary link
      }
    }
    handleCloseImage();
  }

  return (
    <>
      <div className="flex-end absolute top-10 right-1 z-1 flex gap-2.5 sm:top-2">
        <Tooltip
          id="resetChartTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
        />
        <button
          data-tooltip-id="resetChartTooltip"
          data-tooltip-content="Reset Chart View"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "bottom"}`}
          className="cursor-pointer"
          onClick={handleResetChart}
        >
          <RestartAltIcon className="fill-neutral-600! text-[27px]! hover:fill-teal! active:scale-95!" />
        </button>

        <Tooltip
          id="infoTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
          isOpen={openInfoTooltip}
        />
        <button
          data-tooltip-id="infoTooltip"
          data-tooltip-content="Chart Data Information"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "bottom"}`}
          className="cursor-pointer"
          onMouseEnter={() => setOpenInfoTooltip(true)}
          onMouseLeave={() => setOpenInfoTooltip(false)}
          onClick={handleOpenModal}
        >
          <InfoOutlineIcon className="fill-neutral-600! text-[27px]! hover:fill-teal! active:scale-95!" />
        </button>

        <Tooltip
          id="downloadTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
          isOpen={openDownloadTooltip}
        />
        <button
          data-tooltip-id="downloadTooltip"
          data-tooltip-content="Download Data"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "bottom"}`}
          className="cursor-pointer"
          onMouseEnter={() => setOpenDownloadTooltip(true)}
          onMouseLeave={() => setOpenDownloadTooltip(false)}
          onClick={handleOpenDownload}
        >
          <SaveAltIcon className="fill-neutral-600! text-[27px]! hover:fill-teal! active:scale-95!" />
        </button>

        <Tooltip
          id="imageTooltip"
          className="hidden px-1.5! py-0.5! sm:block"
          isOpen={openImageTooltip}
        />
        <button
          data-tooltip-id="imageTooltip"
          data-tooltip-content="Download Image"
          data-tooltip-place={`${window.offsetWidth < 1280 ? "top" : "bottom"}`}
          className="cursor-pointer"
          onMouseEnter={() => setOpenImageTooltip(true)}
          onMouseLeave={() => setOpenImageTooltip(false)}
          onClick={handleOpenImage}
        >
          <ImageIcon className="fill-neutral-600! text-[27px]! hover:fill-teal! active:scale-95!" />
        </button>
      </div>

      <ReactECharts
        option={option(years, seasonData, variable, country, season)}
        // style={{ height: "100%" }}
        className="h-full! w-full"
        notMerge={true}
        lazyUpdate={true}
        ref={echartsRef}
      />

      <Dialog
        onClose={handleCloseModal}
        open={openModal}
        className="text-center"
      >
        <DialogTitle
          className="mb-4! bg-neutral-100 text-3xl! lowercase"
          style={{ fontVariant: "small-caps" }}
        >
          Chart Data Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>CONTENT</DialogContentText>

          <button
            onClick={handleCloseModal}
            className="font-revert mt-4 cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={handleCloseDownload}
        open={openDownload}
        className="text-center"
      >
        <DialogTitle
          className="mb-4! bg-neutral-100 text-3xl! lowercase"
          style={{ fontVariant: "small-caps" }}
        >
          Download Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="flex gap-2">
            <button className="font-revert cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95">
              Chart Dataset
            </button>
            <button className="font-revert cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95">
              Full Dataset
            </button>
          </DialogContentText>

          <button
            onClick={handleCloseDownload}
            className="font-revert mt-4 cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={handleCloseImage}
        open={openImage}
        className="text-center"
      >
        <DialogTitle
          className="mb-4! bg-neutral-100 text-3xl! lowercase"
          style={{ fontVariant: "small-caps" }}
        >
          Download Image
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="flex gap-2">
            <button
              className="font-revert cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95"
              onClick={() => handleSaveImage("png")}
            >
              Save PNG
            </button>
            <button
              className="font-revert cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95"
              onClick={() => handleSaveImage("jpeg")}
            >
              Save JPEG
            </button>
          </DialogContentText>

          <button
            onClick={handleCloseImage}
            className="font-revert mt-4 cursor-pointer rounded bg-neutral-400 px-2 py-1 text-white select-none hover:bg-teal active:scale-95"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
