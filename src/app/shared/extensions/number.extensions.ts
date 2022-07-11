export {};

declare global {
  interface Number {
    getDateByDaysFromNow: () => Date;
  }
}

Number.prototype.getDateByDaysFromNow = function (this: number) {
    const days = this;
    const date = new Date().addDays(days);

    return date;
}