interface SampleLocation {
  value: Location;
  title: string;
}

/** @type {import('@sveltejs/kit').Load} */
export async function load({ fetch }) {
  let locations: SampleLocation[] = [];

  const fileNames = [
    "alameda",
    "california",
    "census-tract",
    "default-location",
    "los-angeles",
    "station"
  ];
  const baseUrl = "/data/locations/";

  try {
    const responses = await Promise.all(
      fileNames.map(async (file) => await fetch(`${baseUrl}${file}.json`))
    );

    const jsons = await Promise.all(
      responses.map(async (res) => await res.json())
    );

    locations = jsons.map((d) => ({
      title: d.title,
      value: d
    }));
    console.log("locations", locations);
  } catch {
    console.error("failed to fetch locations json");
  }

  if (locations && locations.length) {
    return {
      status: 200,
      props: {
        locations
      }
    };
  }

  return {
    status: 404
  };
}
