import { readdirSync, readFileSync } from "fs";
import { extname, join } from "path";

export async function get() {
  const locationDir = join("static", "data", "locations");
  const locations = readdirSync(locationDir)
    .filter((file) => extname(file) === ".json")
    .map((file) => {
      const filePath = join("static", "data", "locations", file);
      const data = readFileSync(filePath, "utf-8");
      const json = JSON.parse(data);
      const title = json.title || "unknown";

      return {
        value: json,
        title
      };
    });

  if (locations) {
    return {
      body: {
        locations
      }
    };
  }

  return {
    status: 404
  };
}
