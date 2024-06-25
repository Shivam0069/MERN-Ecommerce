interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FunsProp = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export function getChartsData({ length, docArr, today, property }: FunsProp) {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff =
      (today.getFullYear() - creationDate.getFullYear()) * 12 +
      today.getMonth() -
      creationDate.getMonth();
    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property]! : 1;
    }
  });
  return data;
}
