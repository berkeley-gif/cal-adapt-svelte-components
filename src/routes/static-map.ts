import { fileURLToPath } from "url";
import { readdirSync, readFileSync } from "fs";
import { dirname, extname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function get() {
  const locationDir = join(__dirname, "..", "data", "locations");
  const locations = readdirSync(locationDir)
    .filter((file) => extname(file) === ".json")
    .map((file) => {
      const filePath = join(__dirname, "..", "data", "locations", file);
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
