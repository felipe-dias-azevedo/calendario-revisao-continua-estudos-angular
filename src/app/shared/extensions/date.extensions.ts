export {};

declare global {
  interface Date {
    clone: () => Date;
    addDays: (days: number) => Date;
    isSameDate: (date: Date) => boolean;
    daysInMonth: (month: number) => number;
  }
}

Date.prototype.clone = function () {
  return new Date(+this);
}

Date.prototype.addDays = function (days: number) {
  if (!days) {
    return this;
  }
  const date = this;
  date.setDate(date.getDate() + days);

  return date;
}

Date.prototype.isSameDate = function (date: Date) {
  return date &&
    this.getFullYear() === date.getFullYear() &&
    this.getMonth() === date.getMonth() &&
    this.getDate() === date.getDate();
}

Date.prototype.daysInMonth = function (month: number) {
  const date = this;
  return new Date(date.getFullYear(), month + 1, 0).getDate();
}
