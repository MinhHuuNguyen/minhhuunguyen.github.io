import { Box, Stack } from "@mui/material";
import Image from "next/image";

interface LogoClusterProps {
  logos: string[];
  alt: string;
  size?: number;
}

/** A row of circular logos that overlap slightly (close together). */
export const LogoCluster = ({ logos, alt, size = 56 }: LogoClusterProps) => (
  <Stack direction="row" sx={{ flexShrink: 0 }}>
    {logos.map((src, i) => (
      <Box
        key={src}
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          bgcolor: "#fff",
          border: "2px solid #fff",
          boxShadow:
            "0 0 0 2px rgba(59, 169, 248, 0.4), rgba(0, 0, 0, 0.12) 0px 4px 10px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: i === 0 ? 0 : `-${Math.round(size / 3)}px`,
          zIndex: logos.length - i,
        }}
      >
        <Image
          src={src}
          alt={`${alt} ${i + 1}`}
          width={size}
          height={size}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: 6,
          }}
        />
      </Box>
    ))}
  </Stack>
);
