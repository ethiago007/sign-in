import React from "react";
import { trio } from 'ldrs'
import { Box } from "@mui/material";

function Preloader() {
    trio.register()
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backgroundColor: "black" 
        }}
      >
        <l-trio
  size="70"
  speed="1.3" 
  color="white" 
></l-trio>
      </Box>
    </>
  );
}

export default Preloader;


