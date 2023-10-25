import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Paper, Stack } from "@mui/material";
import Link from "next/link";
import logo50 from "../../../public/logo50.png";
import MenuSection from "./Menu";

const menuData = [
  {
    name: "Giới thiệu",
    subMenus: [
      { name: "Tầm nhìn và sứ mệnh" },
      {
        name: "Bộ máy tổ chức",
        subMenu2: [
          "Team Trải nghiệm",
          "Team Phim nhạc sách",
          "Team Nhân sự",
          "Team KTSTN",
          "Team Truyền thông",
          "Team Nghiên cứu và phát triển",
          "Quỹ KTCB",
        ],
      },
      { name: "Thông tin liên hệ" },
    ],
  },
  {
    name: "Chương trình",
    subMenus: [
      { name: "Dự án Cùng bé Trải nghiệm" },
      {
        name: "Dự án Phim Nhạc Sách",
      },
      { name: "Các chương trình khác" },
    ],
  },
  {
    name: "Tài chính",
  },
  {
    name: "Bài viết",
  },
  {
    name: "Tham Gia",
    subMenus: [
      { name: "Tình nguyện viên" },
      {
        name: "Nhà hảo tâm",
      },
    ],
  },
];

const Header = () => {
  return (
    <Stack
      component={Paper}
      elevation={4}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      px={20}
      sx={{ py: 2 }}
    >
      <IconButton sx={{ display: ["block", "block", "block", "none"] }}>
        <MenuIcon sx={{ fontSize: 30 }} />
      </IconButton>
      <Link href="/" className="flex items-center">
        <Box
          component="img"
          minWidth={"50px"}
          width={50}
          height={50}
          src={logo50.src}
          alt="Logo"
        ></Box>
      </Link>
      <Box display={["none", "none", "none", "block"]}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={5}
        >
          {menuData.map((menu, index) => (
            <MenuSection key={`${index}menu`} menuData={menu} />
          ))}
        </Stack>
      </Box>

      <IconButton>
        <LanguageIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </Stack>
  );
};

export default Header;
