import { parse } from "csv-parse/sync";

import int_data from "#lib/files/daily_internet_usage_by_age_group.csv?raw";
import per_data from "#lib/files/data.csv?raw";
import young_people_data from "#lib/files/responses.csv?raw";

export function load() {
  const internet_data = parse(int_data, {
    columns: true,
    skip_empty_lines: true,
  });
  const personality_data = parse(per_data, {
    columns: true,
    delimiter: "\t",
    skip_empty_lines: true,
  });
  const young_data = parse(young_people_data, {
    columns: true,
    skip_empty_lines: true,
  });
  return { internet_data, personality_data };
}
