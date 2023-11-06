import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export const ReadMore = styled(Typography)({
    color: "#fff",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.3s ease-in-out",
    transform: "translateY(100%)",
    opacity: 0,
    visibility: "hidden",
});
