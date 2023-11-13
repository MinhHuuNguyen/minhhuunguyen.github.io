import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import menuData from "../../utils/data/json/header.json";
import logoNoBackground from "../../../public/ktcb_logo_no_background.png";

import MenuSection from "./Menu";
import { useState } from "react";
import VerticalMenu from "./Menu/SideMenu/SideMenuSection";
// import { COLORS } from "@/utils/constants";

export type MenuType = typeof menuData;

const Header = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const handleToggleSideMenu = () => {
    setOpenSideMenu((prev) => !prev);
  };

  return (
    <>
      <Stack
        component={Paper}
        elevation={4}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={20}
        my={0}
        sx={{ py: 2 }}
      >
        <IconButton
          sx={{ display: ["block", "block", "block", "none"] }}
          onClick={handleToggleSideMenu}
        >
          <MenuIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Link href="/" className="flex items-center">
          <Box
            component="img"
            minWidth={"50px"}
            height={50}
            src={logoNoBackground.src}
            alt="logoNoBackground"
          ></Box>
        </Link>
        <Box display={["none", "none", "none", "block"]}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={7}
          >
            {menuData.map((menu, index) => (
              <MenuSection key={`${index}menu`} menuData={menu} />
            ))}
          </Stack>
        </Box>

        <IconButton>
          <LanguageIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Stack>

      <Drawer anchor="left" open={openSideMenu} onClose={handleToggleSideMenu}>
        <VerticalMenu menuDatas={menuData} />
      </Drawer>
    </>
  );
};

export default Header;
