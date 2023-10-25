import { Box, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import logo50 from "../../../public/logo50.png";

const footerData = [];

const Footer = () => {
  return (
    <Stack px={[5, 10, 20]} bgcolor="lightblue" width="100%" py={4} mt={2}>
      <Stack
        direction={["column", "row"]}
        justifyContent={["flex-start", "space-between"]}
        flexWrap={["wrap"]}
        alignItems={["flex-start", "center"]}
        bgcolor="lightblue"
        py={2}
      >
        <Stack direction={["column", "column", "row"]} flexWrap="wrap">
          <Stack spacing={2} mr={[0, 0, 0, 20]}>
            <Typography variant="h5" fontWeight="bold">
              Địa chỉ
            </Typography>
            <Typography color="grey">Khương Thượng, Đống Đa, Hà Nội</Typography>
          </Stack>
          <Stack spacing={2} ml={[0, 0, 4]} mt={[4, 4, 0]}>
            <Typography variant="h5" fontWeight="bold">
              Liên hệ
            </Typography>
            <Typography color="grey">
              khoangtroicuabe.kby@gmail.com <br />
              (+84) 346535857
            </Typography>
          </Stack>
        </Stack>

        <Stack mt={[4, 0, 0]} spacing={2}>
          <Link href="/">
            <Box
              component="img"
              width={50}
              height={50}
              bgcolor="red"
              src={logo50.src}
              alt="Logo"
            ></Box>
          </Link>
          <Stack direction="row" spacing={2}>
            <Link href="/">
              <Box
                component="img"
                width={50}
                height={50}
                bgcolor="red"
                src={logo50.src}
                alt="Logo"
              ></Box>
            </Link>
            <Link href="/">
              <Box
                component="img"
                width={50}
                height={50}
                bgcolor="red"
                src={logo50.src}
                alt="Logo"
              ></Box>
            </Link>
            <Link href="/">
              <Box
                component="img"
                width={50}
                height={50}
                bgcolor="red"
                src={logo50.src}
                alt="Logo"
              ></Box>
            </Link>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        direction="row"
        justifyContent={["center", "center", "center", "space-between"]}
        pt={2}
      >
        <Typography color="grey">
          © Copyright 2023. All Rights Reserved.
        </Typography>
        <Box display={["none", "none", "none", "block"]}>
          <Stack direction={"row"} spacing={2}>
            <Typography color="grey">Home</Typography>
            <Typography color="grey">What we do</Typography>
            <Typography color="grey">Our team</Typography>
            <Typography color="grey">News</Typography>
            <Typography color="black">Blogs</Typography>
            <Typography color="grey">Careers</Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Footer;
