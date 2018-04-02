/* eslint-disable */

// date of now
const now = new Date();

// retun a date which means `m` minutes ago comparing to `date`
const interval = (date, m) => new Date(
    date.getTime() - m * 60 * 1000,
);

const checkDate = (date) => {
    const now = new Date();

    return date > now ? now : date;
};

// state
const state = {
    dateTimeStart: interval(now, 15),
    dateTimeEnd: now,
};

// getters
const getters = {
    // shorthands for properties of `state.dateTimeStart`
    hourStart(s) {
        return s.dateTimeStart.getHours();
    },
    minuteStart(s) {
        return s.dateTimeStart.getMinutes();
    },
    secondStart(s) {
        return s.dateTimeStart.getSeconds();
    },
    yearStart(s) {
        return s.dateTimeStart.getFullYear();
    },
    monthStart(s) {
        return s.dateTimeStart.getMonth();
    },
    dayStart(s) {
        return s.dateTimeStart.getDate();
    },

    // shorthands for properties of `state.dateTimeEnd`
    hourEnd(s) {
        return s.dateTimeEnd.getHours();
    },
    minuteEnd(s) {
        return s.dateTimeEnd.getMinutes();
    },
    secondEnd(s) {
        return s.dateTimeEnd.getSeconds();
    },
    yearEnd(s) {
        return s.dateTimeEnd.getFullYear();
    },
    monthEnd(s) {
        return s.dateTimeEnd.getMonth();
    },
    dayEnd(s) {
        return s.dateTimeEnd.getDate();
    },
};

const mutations = {
    // mutations for updating `state.dateTimeStart` and `state.dateTimeEnd`
    EDIT_DATE_TIME_START(state, date) {
        state.dateTimeStart = date;
    },
    EDIT_DATE_TIME_END(state, date) {
        state.dateTimeEnd = date;
    },

    // mutations for quickly choosing a time range
    EDIT_LAST15MINUTES(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 15);
        s.dateTimeEnd = date;
    },
    EDIT_LAST30MINUTES(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 30);
        s.dateTimeEnd = date;
    },
    EDIT_LAST45MINUTES(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 45);
        s.dateTimeEnd = date;
    },
    EDIT_LAST1HOUR(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60);
        s.dateTimeEnd = date;
    },
    EDIT_LAST4HOURS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 4);
        s.dateTimeEnd = date;
    },
    EDIT_LAST12HOURS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 12);
        s.dateTimeEnd = date;
    },
    EDIT_LAST24HOURS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 24);
        s.dateTimeEnd = date;
    },
    EDIT_LAST7DAYS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 24 * 7);
        s.dateTimeEnd = date;
    },
    EDIT_LAST30DAYS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 24 * 30);
        s.dateTimeEnd = date;
    },
    EDIT_LAST60DAYS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 24 * 60);
        s.dateTimeEnd = date;
    },
    EDIT_LAST90DAYS(s) {
        const date = new Date();
        s.dateTimeStart = interval(date, 60 * 24 * 90);
        s.dateTimeEnd = date;
    },
    EDIT_LAST6MONTHS(s) {
        const date = new Date();
        s.dateTimeStart = new Date(
            date.getFullYear(),
            date.getMonth() - 6,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            0,
        );
        s.dateTimeEnd = date;
    },
    EDIT_LAST1YEAR(s) {
        const date = new Date();
        s.dateTimeStart = new Date(
            date.getFullYear() - 1,
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            0,
        );
        s.dateTimeEnd = date;
    },
    EDIT_LAST2YEARS(s) {
        const date = new Date();
        s.dateTimeStart = new Date(
            date.getFullYear() - 2,
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            0,
        );
        s.dateTimeEnd = date;
    },
    EDIT_LAST5YEARS(s) {
        const date = new Date();
        s.dateTimeStart = new Date(
            date.getFullYear() - 5,
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            0,
        );
        s.dateTimeEnd = date;
    },
    EDIT_TODAY(s) {
        const date = new Date();

        s.dateTimeStart = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );
        s.dateTimeEnd = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1,
        );
    },
    EDIT_YESTERDAY(s) {
        const date = new Date();
        s.dateTimeStart = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1,
        );
        s.dateTimeEnd = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );
    },
    EDIT_THISWEEK(s) {
        const date = new Date();

        if (date.getDay() !== 0) {
            s.dateTimeStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - date.getDay() + 1,
                0,
            );
            s.dateTimeEnd = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + (7 - date.getDay() + 1),
                0,
            );
        } else if (date.getDay() === 0) {
            s.dateTimeStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - 7 + 1,
                0,
            );
            s.dateTimeEnd = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + (7 - 7 + 1),
                0,
            );
        }
    },
    EDIT_THISMONTH(s) {
        const date = new Date();

        s.dateTimeStart = new Date(
            date.getFullYear(),
            date.getMonth(),
        );
        s.dateTimeEnd = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
        );
    },
    EDIT_THISYEAR(s) {
        const date = new Date();

        s.dateTimeStart = new Date(
            date.getFullYear(),
            0,
        );
        s.dateTimeEnd = new Date(
            date.getFullYear() + 1,
            0,
        );
    },
    EDIT_THISDAYSOFAR(s) {
        const date = new Date();

        s.dateTimeStart = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
        );
        s.dateTimeEnd = date;
    },
    EDIT_WEEKTODATE(s) {
        const date = new Date();

        if (date.getDay() !== 0) {
            s.dateTimeStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - date.getDay() + 1,
                0,
            );
        } else if (date.getDay() === 0) {
            s.dateTimeStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - 7 + 1,
                0,
            );
        }
        s.dateTimeEnd = date;
    },
    EDIT_MONTHTODATE(s) {
        const date = new Date();

        s.dateTimeStart = new Date(
            date.getFullYear(),
            date.getMonth(),
        );
        s.dateTimeEnd = date;
    },
    EDIT_YEARTODATE(s) {
        const date = new Date();

        s.dateTimeStart = new Date(
            date.getFullYear(),
            0,
        );
        s.dateTimeEnd = date;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};
