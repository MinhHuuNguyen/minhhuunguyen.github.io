import { Box, Button, Menu, MenuItem } from "@mui/material";
import { NestedMenuItem } from "mui-nested-menu";
import Link from "next/link";
import { useState } from "react";

type MenuSectionProps = {
  menuData: {
    name: string;
    subMenus?: {
      name: string;
      path?: string;
      subMenu2?: { name: string; path: string }[];
    }[];
  };
};

const MenuSection: React.FC<MenuSectionProps> = ({ menuData }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!!anchorEl) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseOver={handleClick}
        sx={{
          whiteSpace: "nowrap",
          cursor: "pointer",
          color: "black",
          "&:hover": {
            color: "lightGreen",
          },
        }}
      >
        {menuData.name}
      </Button>
      {!!menuData.subMenus && (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ onMouseLeave: handleClose }}
        >
          {menuData.subMenus.map((subMenu) => {
            if (subMenu.subMenu2) {
              return (
                <NestedMenuItem
                  key={subMenu.name}
                  label={subMenu.name}
                  parentMenuOpen={open}
                >
                  {subMenu.subMenu2.map((item) => (
                    <Link key={item.name} href={item.path}>
                      <MenuItem data-value={"sub-menu-item"}>
                        {item.name}
                      </MenuItem>
                    </Link>
                  ))}
                </NestedMenuItem>
              );
            }
            return (
              <Link key={subMenu.name} href={subMenu.path ?? ""}>
                <MenuItem onClick={handleClose} sx={{ marginLeft: -0.5 }}>
                  {subMenu.name}
                </MenuItem>
              </Link>
            );
          })}
        </Menu>
      )}
    </Box>
  );
};

export default MenuSection;
