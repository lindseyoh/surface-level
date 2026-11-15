// src/lib/utils/averages.js

// @ts-ignore
export function averageByAge(data, groupBy, value) {
  const columns = [
    "social_media_hours",
    "work_or_study_hours",
    "entertainment_hours",
    "total_screen_time",
  ];

  const filtered = data.filter(
    // @ts-ignore
    (point) => String(point[groupBy]) === String(value),
  );

  const result = { label: value };

  for (const column of columns) {
    const values = filtered
      // @ts-ignore
      .map((point) => point[column])
      // @ts-ignore
      .filter((value) => value != null && String(value).trim() !== "")
      .map(Number)
      .filter(Number.isFinite);

    // @ts-ignore
    result[column] = values.length
      ? // @ts-ignore
        values.reduce((sum, number) => sum + number, 0) / values.length
      : null;
  }

  return result;
}
// @ts-ignore
export function average5(data, groupBy, value) {
  const columns = ["N1", "N6", "A5", "N2", "A4", "N3"];

  const filtered = data.filter(
    // @ts-ignore
    (point) => String(point[groupBy]) === String(value),
  );

  const result = { label: value };

  for (const column of columns) {
    const values = filtered
      // @ts-ignore
      .map((point) => point[column])
      // @ts-ignore
      .filter((value) => value != null && String(value).trim() !== "")
      .map(Number)
      .filter(Number.isFinite);

    // @ts-ignore
    result[column] = values.length
      ? // @ts-ignore
        values.reduce((sum, number) => sum + number, 0) / values.length
      : null;
  }

  return result;
}
