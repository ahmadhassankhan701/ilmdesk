"use client";
import { Box, Modal, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
const style = {
  width: "100%",
  height: "100%",
  bgcolor: "lightgray",
  border: "none",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
};

export default function PDFModal({ open, setOpen, url }) {
  const handleClose = () => {
    setOpen(false);
  };
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
          <Box
            height={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"flex-end"}
              width={"100%"}
              bgcolor={"rgb(60, 60, 60)"}
            >
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  zIndex: 2,
                  color: "red",
                  my: 1,
                  bgcolor: "gray",
                }}
                color="gray"
              >
                <Close sx={{ color: "#fff", fontSize: 13 }} />
              </IconButton>
            </Box>
            {url && (
              <iframe
                src={url + "#toolbar=0"}
                height={"100%"}
                width={"100%"}
                frameborder="0"
              ></iframe>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
