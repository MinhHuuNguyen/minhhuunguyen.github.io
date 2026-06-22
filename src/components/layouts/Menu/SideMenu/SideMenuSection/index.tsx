import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type SubMenuItem = { name: string; path: string };

type SubMenu = {
  name: string;
  path?: string;
  subMenu2?: SubMenuItem[];
};

type MenuData = {
  name: string;
  path: string;
  subMenus?: SubMenu[];
};

const MenuSection = ({ menuData }: { menuData: MenuData }) => {
  const { name, path, subMenus } = menuData;

  return (
    <Accordion>
      {!subMenus ? (
        <MenuItem
          sx={{
            height: "48px",
          }}
        >
          <a href={path}>{name}</a>
        </MenuItem>
      ) : (
        <AccordionSummary
          sx={{
            height: "48px",
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>{name}</Typography>
        </AccordionSummary>
      )}

      <AccordionDetails>
        {!!subMenus &&
          subMenus.map((subMenu) => {
            if (!subMenu.subMenu2) {
              return (
                <MenuItem key={subMenu.name} sx={{ py: 2 }}>
                  <a href={subMenu.path}>{subMenu.name}</a>
                </MenuItem>
              );
            }
            return (
              <Accordion key={subMenu.name}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ boxShadow: "none" }}
                >
                  <Typography mt={1}>{subMenu.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {subMenu.subMenu2.map((item) => {
                    return (
                      <MenuItem key={`${subMenu.name}-${item.name}`} sx={{ py: 2 }}>
                        <a href={item.path}>{item.name}</a>
                      </MenuItem>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
      </AccordionDetails>
    </Accordion>
  );
};

const VerticalMenu = ({ menuDatas }: { menuDatas: MenuData[] }) => {
  return (
    <div>
      {menuDatas.map((menu) => (
        <MenuSection key={menu.name} menuData={menu} />
      ))}
    </div>
  );
};

export default VerticalMenu;
