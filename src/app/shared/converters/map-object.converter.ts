export function mapToObject(map: Map<any, any>) {
  let obj = new Object();
  obj = [...map].reduce((o, [key, value]) => ((o[key] = value), o), {});

  return obj;
}

export function objectToMap<K, V>(obj: Object): Map<K, V> {
  let map = new Map();

  if (obj != null) {
    Object.keys(obj).forEach((key) => {
      map.set(key, obj[key]);
    });
  }

  return map;
}
