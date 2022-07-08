import {AbstractControl} from "@angular/forms";

export function isSubjectDayRepeated(days: number[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const value = control.value;
        if (value === undefined || value === null || isNaN(value) || value < 0) {
            return {notNumberInvalid: true};
        }
        if (days.includes(value)) {
            return {dayRepeatedInvalid: true};
        }
        return null;
    }
}