import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useI18n } from "@/libs/i18n/I18nContext";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import menuData from "../../utils/data/header.json";
import logoRectangle from "../../../public/minhhuunguyen-logo-square.jpg";

import MenuSection from "./Menu";
import { useState } from "react";
import VerticalMenu from "./Menu/SideMenu/SideMenuSection";
import Image from "next/image";

export type MenuType = typeof menuData;

const Header = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { locale, toggleLocale } = useI18n();

  const handleToggleSideMenu = () => {
    setOpenSideMenu((prev) => !prev);
  };

  return (
    <Box
      sx={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px" }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          py: 1,
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        <IconButton
          sx={{ display: ["block", "block", "block", "none"] }}
          onClick={handleToggleSideMenu}
        >
          <MenuIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Link href="/" className="flex items-center">
          <Image src={logoRectangle.src} alt="logoRectangle" width={50} height={50}
          />
        </Link>
        <Box display={["none", "none", "none", "block"]}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={10}
          >
            {menuData.map((menu, index) => (
              <MenuSection key={`${index}menu`} menuData={menu} />
            ))}
          </Stack>
        </Box>

        <Button
          onClick={toggleLocale}
          startIcon={<LanguageIcon sx={{ fontSize: 20 }} />}
          color="inherit"
          size="small"
          aria-label="Toggle language"
          sx={{ textTransform: "uppercase", minWidth: 0 }}
        >
          {locale}
        </Button>
      </Stack>

      <Drawer anchor="left" open={openSideMenu} onClose={handleToggleSideMenu}>
        <VerticalMenu menuDatas={menuData} />
      </Drawer>
    </Box>
  );
};

export default Header;
