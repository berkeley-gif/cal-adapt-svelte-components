import { readdirSync, readFileSync } from "fs";
import { extname, resolve } from "path";

export async function get() {
  const locations = readdirSync(resolve("src/data/locations"))
    .filter((file) => extname(file) === ".json")
    .map((file) => {
      const data = readFileSync(resolve(`src/data/locations/${file}`), "utf-8");
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
