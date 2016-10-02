export const delayOnceTimeAction = {
    oneTimeActions: {},

    // bind: function (delay, id, action) {
    bind(delay, id, action) {
        // is there already a timer? clear if if there is
        if (this.oneTimeActions[id]) clearTimeout(this.oneTimeActions[id]);

        // set a new timer to execute delay milliseconds from last call
        this.oneTimeActions[id] = setTimeout(() => {
            action();
        }, delay);
    },
};

export const dateUtil = {
    formatDateYYYYMMDD(date, separator) {
        let monthStr = (date.getMonth() + 1).toString();
        monthStr = (monthStr[1]) ? monthStr : `0${monthStr[0]}`;

        let dateStr = date.getDate().toString();
        dateStr = (dateStr[1]) ? dateStr : `0${dateStr[0]}`;

        return `${date.getFullYear()}${separator}${monthStr}${separator}${dateStr}`;
    },
};
