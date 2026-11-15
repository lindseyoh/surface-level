import { parse } from "csv-parse/sync";

import int_data from "#lib/files/daily_internet_usage_by_age_group.csv?raw";
import per_data from "#lib/files/data.csv?raw";

const internet_data = parse(int_data, {
  columns: true,
  skip_empty_lines: true,
});

const personality_data = parse(per_data, {
  columns: true,
  delimiter: "\t",
  skip_empty_lines: true,
});

// Average for each individual age
function averageByAge(data) {
  const grouped = {};

  for (const point of data) {
    const age = point.age;

    if (!grouped[age]) {
      grouped[age] = {
        social_media_hours: 0,
        work_or_study_hours: 0,
        entertainment_hours: 0,
        total_screen_time: 0,
        count: 0,
      };
    }

    grouped[age].social_media_hours += Number(point.social_media_hours);
    grouped[age].work_or_study_hours += Number(point.work_or_study_hours);
    grouped[age].entertainment_hours += Number(point.entertainment_hours);
    grouped[age].total_screen_time += Number(point.total_screen_time);
    grouped[age].count++;
  }

  return Object.entries(grouped)
    .map(([age, values]) => ({
      age: Number(age),
      social_media_hours: values.social_media_hours / values.count,
      work_or_study_hours: values.work_or_study_hours / values.count,
      entertainment_hours: values.entertainment_hours / values.count,
      total_screen_time: values.total_screen_time / values.count,
    }))
    .sort((a, b) => a.age - b.age);
}

// Average for each age range
function averageByAgeGroup(data) {
  const ageGroups = ["13-18", "19-25", "26-35", "36-45", "46-60", "60+"];

  const columns = [
    "social_media_hours",
    "work_or_study_hours",
    "entertainment_hours",
    "total_screen_time",
  ];

  const grouped = {};

  for (const point of data) {
    const age = Number(point.age);
    let group;

    if (age >= 13 && age <= 18) group = "13-18";
    else if (age >= 19 && age <= 25) group = "19-25";
    else if (age >= 26 && age <= 35) group = "26-35";
    else if (age >= 36 && age <= 45) group = "36-45";
    else if (age >= 46 && age <= 60) group = "46-60";
    else if (age > 60) group = "60+";
    else continue;

    // Initialize the group before adding values
    if (!grouped[group]) {
      grouped[group] = { count: 0 };

      for (const column of columns) {
        grouped[group][column] = 0;
      }
    }

    for (const column of columns) {
      grouped[group][column] += Number(point[column]);
    }

    grouped[group].count++;
  }

  return ageGroups
    .filter((group) => grouped[group])
    .map((group) => {
      const result = { label: group };

      for (const column of columns) {
        result[column] = grouped[group][column] / grouped[group].count;
      }

      return result;
    });
}

export function load() {
  return {
    internet_data,
    personality_data,
    average_by_age: averageByAge(internet_data),
    average_by_age_group: averageByAgeGroup(internet_data),
  };
}
