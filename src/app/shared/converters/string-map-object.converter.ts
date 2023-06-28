export function stringMapToJson(map: Map<string, string[]>): string {
  const obj = stringMapToObject(map);
  if (obj) {
    return JSON.stringify(obj);
  }
  return null;
}

export function stringMapToObject(map: Map<string, string[]>): any {
  if (!map || map.size === 0) {
    return null;
  }

  const obj = {};
  map.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

export function jsonToStringMap(json: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  let mapObject = {};
  let properties = [];
  try {
    mapObject = JSON.parse(json);
    properties = Object.entries(mapObject);
  } catch (e) {
    console.error("Could not parse JSON", e);
    return map;
  }

  properties.forEach((prop) => {
    let aggregation = map.get(prop[0]);
    if (!aggregation) {
      aggregation = [];
    }
    for (const aggBucket of prop[1] as string[]) {
      aggregation.push(aggBucket);
    }
    map.set(prop[0], aggregation);
  });
  return map;
}
