import {AbstractControl} from "@angular/forms";

export function isTilYearEnd(control: AbstractControl) {

    const value = control.value

    if (value === undefined || value === null || isNaN(value) || value < 0) {
        return {notNumberInvalid: true};
    }

    const daysTilYearEnd = new Date().daysTilYearEnd();

    if (value > daysTilYearEnd) {
        return {tilYearEndInvalid: true};
    }

    return null;
}