export const formatDZD = (amount, isArabic = false) => {
  if (amount === undefined || amount === null) return "-";
  const num = Number(amount);
  const formatted = num.toLocaleString("fr-DZ");
  return isArabic ? `${formatted} دج` : `${formatted} DZD`;
};

export const formatDate = (dateString, isArabic = false) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString(isArabic ? "ar-DZ" : "fr-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
