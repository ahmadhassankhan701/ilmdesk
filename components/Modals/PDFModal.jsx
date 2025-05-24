"use client";
import { Box, Modal, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
const style = {
  width: "100%",
  height: "100%",
  bgcolor: "lightgray",
  border: "none",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  overflow: "auto",
};

export default function PDFModal({ open, setOpen, url }) {
  const handleClose = () => {
    setNumPages(0);
    setOpen(false);
  };
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: "absolute",
              right: { xs: 5, sm: 50 },
              top: 13,
              zIndex: 2,
              bgcolor: "gray",
            }}
          >
            <Close sx={{ color: "#fff", fontSize: 20 }} />
          </IconButton>
          {url && (
            <Box height={"100vh"}>
              <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={(e) => e.preventDefault()}
                className={"pdf-container"}
              >
                {Array.apply(null, Array(numPages))
                  .map((x, i) => i + 1)
                  .map((page) => {
                    return (
                      <Page
                        pageNumber={page}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    );
                  })}
              </Document>
              {/* <iframe
                src={url + "#toolbar=0"}
                height={"100%"}
                width={"100%"}
                frameborder="0"
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
              ></iframe> */}
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
