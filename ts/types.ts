type RealType =
  | "boolean"
  | "number"
  | "string"
  | "array"
  | "object"
  | "function"
  | "null"
  | "undefined"
  | "NaN"
  | "date"
  | "regexp"
  | "Set"
  | "Map"
  | "WeakSet"
  | "WeakMap"
  | "Infinity"
  | "bigint"
  | "symbol";

type TestValue =
  | boolean
  | number
  | string
  | object
  | null
  | undefined
  | Function
  | Date
  | RegExp
  | Set<unknown>
  | Map<unknown, unknown>
  | WeakSet<object>
  | WeakMap<object, unknown>
  | symbol
  | bigint;

// Test utils

const testBlock = (name: string): void => {
  console.groupEnd();
  console.group(`# ${name}\n`);
};

const areEqual = (a: TestValue, b: TestValue): boolean => {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!areEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  return false;
};

const test = (
  whatWeTest: string,
  actualResult: TestValue,
  expectedResult: TestValue
): void => {
  if (areEqual(actualResult, expectedResult)) {
    console.log(`[OK] ${whatWeTest}\n`);
  } else {
    console.error(`[FAIL] ${whatWeTest}`);
    console.debug("Expected:");
    console.debug(expectedResult);
    console.debug("Actual:");
    console.debug(actualResult);
    console.log("");
  }
};

// Functions

const getType = (value: TestValue): string => {
  return typeof value;
};

const getTypesOfItems = (arr: TestValue[]): string[] => {
  return arr.map((v) => typeof v);
};
const allItemsHaveTheSameType = (arr: TestValue[]): boolean => {
  return arr.every((v) => typeof v === typeof arr[0]);
};

const getRealType = (value: TestValue): RealType => {
  if (value instanceof Date) {
    return "date";
  }
  if (Number.isNaN(value)) {
    return "NaN";
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "function") {
    return "function";
  }
  if (value instanceof RegExp) {
    return "regexp";
  }
  if (value instanceof Set) {
    return "Set";
  }
  if (value instanceof Map) {
    return "Map";
  }
  if (value instanceof WeakSet) {
    return "WeakSet";
  }
  if (value instanceof WeakMap) {
    return "WeakMap";
  }
  if (value === Infinity || value === -Infinity) {
    return "Infinity";
  }
  if (typeof value === "object") {
    return "object";
  }
  return typeof value;
};

const getRealTypesOfItems = (arr: TestValue[]): RealType[] => {
  return arr.map((v) => getRealType(v));
};

const everyItemHasAUniqueRealType = (arr: TestValue[]): boolean => {
  const typesOfArrItems = getRealTypesOfItems(arr);
  return new Set(typesOfArrItems).size === arr.length;
};

const countRealTypes = (arr: TestValue[]): [RealType, number][] => {
  const typeCountMap = new Map<RealType, number>();
  arr.forEach((item) => {
    const realType = getRealType(item);
    typeCountMap.set(realType, (typeCountMap.get(realType) || 0) + 1);
  });
  const typeCountArray = [...typeCountMap];

  return typeCountArray.sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });
};
// Tests

testBlock("getType");

test("Boolean", getType(true), "boolean");
test("Number", getType(123), "number");
test("String", getType("whoo"), "string");
test("Array", getType([]), "object");
test("Object", getType({}), "object");
test(
  "Function",
  getType(() => {}),
  "function"
);
test("Undefined", getType(undefined), "undefined");
test("Null", getType(null), "object");

testBlock("allItemsHaveTheSameType");

test("All values are numbers", allItemsHaveTheSameType([11, 12, 13]), true);

test(
  "All values are strings",
  allItemsHaveTheSameType(["11", "12", "13"]),
  true
);

test(
  "All values are strings but wait",
  allItemsHaveTheSameType(["11", new String("12"), "13"]),
  false
);

test("Values like a number", allItemsHaveTheSameType([123, NaN, 1 / 0]), true);

test("Values like an object", allItemsHaveTheSameType([{}]), true);

testBlock("getTypesOfItems VS getRealTypesOfItems");

const knownTypes = [
  true,
  1,
  "house",
  [],
  {},
  function () {},
  undefined,
  null,
  NaN,
  Infinity,
  new Date(),
  /regex/,
  Symbol("sym"),
  BigInt(123),
  new Set([1, 2, 3]),
  new Map([
    [1, "one"],
    [2, "two"],
  ]),
];

test("Check basic types", getTypesOfItems(knownTypes), [
  "boolean",
  "number",
  "string",
  "object",
  "object",
  "function",
  "undefined",
  "object",
  "number",
  "number",
  "object",
  "object",
  "symbol",
  "bigint",
  "object",
  "object",
]);

test("Check real types", getRealTypesOfItems(knownTypes), [
  "boolean",
  "number",
  "string",
  "array",
  "object",
  "function",
  "undefined",
  "null",
  "NaN",
  "Infinity",
  "date",
  "regexp",
  "symbol",
  "bigint",
  "Set",
  "Map",
]);

testBlock("everyItemHasAUniqueRealType");

test(
  "All value types in the array are unique",
  everyItemHasAUniqueRealType([true, 123, "123"]),
  true
);

// @ts-expect-error чтобы ts не ругался на '123' === 123 и была возможность использовать тест кейс из задания.
test(
  "Two values have the same type",
  everyItemHasAUniqueRealType([true, 123, "123" === 123]),
  false
);

test(
  "There are no repeated types in knownTypes",
  everyItemHasAUniqueRealType(knownTypes),
  true
);

testBlock("countRealTypes");

// @ts-expect-error чтобы ts не ругался на !null и !!null и была возможность использовать тест кейс из задания.
test(
  "Count unique types of array items",
  countRealTypes([true, null, !null, !!null, {}]),
  [
    ["boolean", 3],
    ["null", 1],
    ["object", 1],
  ]
);

// @ts-expect-error чтобы ts не ругался на !null и !!null и была возможность использовать тест кейс из задания.
test(
  "Counted unique types are sorted",
  countRealTypes([{}, null, true, !null, !!null]),
  [
    ["boolean", 3],
    ["null", 1],
    ["object", 1],
  ]
);
