import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useI18n } from "@/libs/i18n/I18nContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Presentational search input for the blog page. State lives in the parent
 * (blog/index.tsx); this only renders the field and emits changes.
 */
export const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
  const { t } = useI18n();

  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("blog.searchPlaceholder")}
      aria-label={t("blog.searchPlaceholder")}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={onClear}
              aria-label="Clear search"
              edge="end"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
        sx: { borderRadius: "10px" },
      }}
    />
  );
};
