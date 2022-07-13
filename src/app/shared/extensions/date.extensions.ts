export {};

declare global {
  interface Date {
    clone: () => Date;
    addDays: (days: number) => Date;
    isSameDate: (date: Date) => boolean;
    daysInMonth: (month: number) => number;
    diffInDays: (date: Date) => number;
    daysTilYearEnd: () => number;
    getDateOfMonth: (month: number) => Date;
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

Date.prototype.diffInDays = function (date: Date) {
  const thisDate = this;
  const utc1 = Date.UTC(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate());
  const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

Date.prototype.daysTilYearEnd = function () {
  const currentYear = new Date().getFullYear();
  const yearEnd = new Date(currentYear, 11, 31);
  const now = this;

  return now.diffInDays(yearEnd);
}

Date.prototype.getDateOfMonth = function (month: number) {
  let date = this.clone();
  const actualMonth = date.getMonth() + month;
  date.setMonth(actualMonth);
  
  return date;
}