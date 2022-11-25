/**
 * Transform an object to a 1 level object
 * e.g. { a: { b: { c : 1 } } } => { 'a.b.c': 1 }
 */
export function flatten(obj: any) {
  const getKeyValue = (prepend: string, value: any) => {
    if (typeof value === "object") {
      return Object.entries(value).flatMap(([k, v]) =>
        getKeyValue(`${prepend}.${k}`, v)
      );
    }

    return [[prepend, value]];
  };

  return Object.entries(obj).reduce((acc, [k, v]) => {
    getKeyValue(k, v).forEach(([key, value]) => {
      acc[key] = value;
    });
    return acc;
  }, {});
}

export function safelyParse<T>(obj: any): T {
  try {
    return JSON.parse(obj) as T;
  } catch {
    return null;
  }
}

export interface Serializable {
  serialize: (data: any) => string;
  deserialize: (data: string) => any;
}

export function stringify(
  obj: any,
  options?: { pretty?: boolean; timestamp?: boolean }
) {
  return JSON.stringify(obj, null, options?.pretty ? "  " : undefined);
}

export function parse<T>(serialized: string): T {
  return JSON.parse(serialized, (k: string, v: any) => {
    return v;
  });
}

export function clean(obj) {
  return JSON.parse(JSON.stringify(obj));
}
