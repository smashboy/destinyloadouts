export const getPopularDuringDate = (
  key: "TODAY" | "WEEK" | "MONTH" | "ALL_TIME"
) => {
  const today = new Date();

  switch (key) {
    case "TODAY":
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    case "WEEK":
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
    case "MONTH":
      return new Date(today.getFullYear(), today.getMonth(), 1);
    default:
      return null;
  }
};
