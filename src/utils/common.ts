
export const ellipsisText = (lineClamp = 1) => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: `${lineClamp}`,
    WebkitBoxOrient: "vertical",
  };
};
