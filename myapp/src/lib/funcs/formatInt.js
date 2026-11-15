// src/lib/utils/chartHelpers.js

/**
 * @param {{ social_media_hours: any; work_or_study_hours: any; entertainment_hours: any; total_screen_time: any; }} averages
 */
export function screenTimePoints(averages) {
  return [
    {
      label: "Social Media",
      value: averages.social_media_hours,
    },
    {
      label: "Work/Study",
      value: averages.work_or_study_hours,
    },
    {
      label: "Entertainment",
      value: averages.entertainment_hours,
    },
    {
      label: "Total Screen Time",
      value: averages.total_screen_time,
    },
  ];
}
