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
    formatDateMMDDYYYY(date, separator) {
        let monthStr = (date.getMonth() + 1).toString();
        monthStr = (monthStr[1]) ? monthStr : `0${monthStr[0]}`;

        let dateStr = date.getDate().toString();
        dateStr = (dateStr[1]) ? dateStr : `0${dateStr[0]}`;

        return `${monthStr}${separator}${dateStr}${separator}${date.getFullYear()}`;
    },
};

export const restUtil = {
    requestGetHelper(d2Api, url, successFunc) {
        d2Api.get(url).then(result => {
            successFunc(result);
        });
    },
};

export const otherUtils = {
    removeFromList(list, propertyName, value) {
        let index;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item[propertyName] === value) {
                index = i;
                break;
            }
        }

        if (index !== undefined) {
            list.splice(index, 1);
        }

        return index;
    },

    findItemFromList(listData, searchProperty, searchValue) {
        let foundData;

        for (let i = 0; i < listData.length; i++) {
            const item = listData[i];
            if (item[searchProperty] === searchValue) {
                foundData = item;
            }
        }

        return foundData;
    },

    sortByKey(array, key) {
        return array.sort((a, b) => {
            const x = a[key];
            const y = b[key];
            if (x < y) {
                return -1;
            } else if (x > y) {
                return 1;
            }

            return 0;
        });
    },

    parseStringToHTML(str) {
        return $.parseHTML(str);
    },

    trim(input) {
        return input.replace(/^\s+|\s+$/gm, '');
    },

    // App specific help methods
    advSearchStr: '[ADV]',

    checkAdvancedSearch(inputStr) {
        let check = false;
        if (inputStr) {
            const trimmedStr = this.trim(inputStr);
            check = (trimmedStr.indexOf(this.advSearchStr) === 0);
        }
        return check;
    },
};
