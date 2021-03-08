import $ from 'jquery'

/* eslint-disable max-params */

export const delayOnceTimeAction = {
    oneTimeActions: {},

    // bind: function (delay, id, action) {
    bind(delay, id, action) {
        // is there already a timer? clear if if there is
        if (this.oneTimeActions[id]) clearTimeout(this.oneTimeActions[id])

        // set a new timer to execute delay milliseconds from last call
        this.oneTimeActions[id] = setTimeout(() => {
            action()
        }, delay)
    },
}

export const dateUtil = {
    formatDateYYYYMMDD(date, separator) {
        let monthStr = (date.getMonth() + 1).toString()
        monthStr = monthStr[1] ? monthStr : `0${monthStr[0]}`

        let dateStr = date.getDate().toString()
        dateStr = dateStr[1] ? dateStr : `0${dateStr[0]}`

        return `${date.getFullYear()}${separator}${monthStr}${separator}${dateStr}`
    },
    formatDateMMDDYYYY(date, separator) {
        let monthStr = (date.getMonth() + 1).toString()
        monthStr = monthStr[1] ? monthStr : `0${monthStr[0]}`

        let dateStr = date.getDate().toString()
        dateStr = dateStr[1] ? dateStr : `0${dateStr[0]}`

        return `${monthStr}${separator}${dateStr}${separator}${date.getFullYear()}`
    },
}

export const restUtil = {
    getUrlBase_Formatted(d2) {
        let url = d2.Api.getApi().baseUrl.replace('/api', '')
        const lastChar = url.substring(url.length - 1)

        if (lastChar === '/') url = url.substring(0, url.length - 1)

        return url
    },

    requestGetHelper(d2Api, url, successFunc) {
        d2Api.get(url).then(result => {
            successFunc(result)
        })
    },
    requestPostHelper(d2Api, url, value, successFunc, returnContentType) {
        const returnContType =
            returnContentType === undefined ? 'text/plain' : returnContentType
        restUtil.requestHelper(
            d2Api,
            url,
            value,
            successFunc,
            'POST',
            returnContType
        )
        /*d2Api.post(url, value, { contentType: 'text/plain' })
            .then(successFunc)
            .catch(errorResponse => {
                console.log(errorResponse);
            });
        */
    },
    requestHelper(
        d2Api,
        url,
        value,
        successFunc,
        requestType,
        returnContentType
    ) {
        const reqType = requestType === undefined ? 'POST' : requestType
        const returnContType =
            returnContentType === undefined ? 'text/plain' : returnContentType
        d2Api
            .request(reqType, url, value, { contentType: returnContType })
            .then(successFunc)
            .catch(errorResponse => {
                console.log(errorResponse)
            })
    },
}

export const dhisUtils = {
    getMatchingApiObjTypeName(dataType) {
        let dhisApiObjName = ''
        if (dataType === 'REPORT_TABLE') {
            dhisApiObjName = 'reportTables'
        } else if (dataType === 'CHART') {
            dhisApiObjName = 'charts'
        } else if (dataType === 'MAP') {
            dhisApiObjName = 'maps'
        } else if (dataType === 'EVENT_REPORT') {
            dhisApiObjName = 'eventReports'
        } else if (dataType === 'EVENT_CHART') {
            dhisApiObjName = 'eventCharts' // Event chart
        }

        return dhisApiObjName
    },
}

export const otherUtils = {
    removeFromList(list, propertyName, value) {
        let index

        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item[propertyName] === value) {
                index = i
                break
            }
        }

        if (index !== undefined) {
            list.splice(index, 1)
        }

        return index
    },

    findItemFromList(listData, searchProperty, searchValue) {
        let foundData

        for (let i = 0; i < listData.length; i++) {
            const item = listData[i]
            if (item[searchProperty] === searchValue) {
                foundData = item
            }
        }

        return foundData
    },

    findInArray(arr, valueStr) {
        let foundIndex = -1

        if (arr !== undefined && valueStr !== undefined) {
            foundIndex = arr.indexOf(valueStr)
        }

        return foundIndex
    },

    sortByKey(array, key) {
        return array.sort((a, b) => {
            const x = a[key]
            const y = b[key]
            if (x < y) {
                return -1
            } else if (x > y) {
                return 1
            }

            return 0
        })
    },

    parseStringToHTML(str) {
        return $.parseHTML(str)
    },

    trim(input) {
        return input.replace(/^\s+|\s+$/gm, '')
    },

    // App specific help methods
    advSearchStr: '[ADV]',

    checkAdvancedSearch(inputStr) {
        let check = false
        if (inputStr) {
            const trimmedStr = this.trim(inputStr)
            check = trimmedStr.indexOf(this.advSearchStr) === 0
        }
        return check
    },

    convertToNumber(n) {
        return n.startsWith('0') ? eval(n[1]) : eval(n)
    },
    // nameBeginsWith - 'srcObj_'
    getClassName_ByBeginName(tag, nameBeginsWith) {
        const classNameArr = tag.attr('class').split(' ')
        let foundName = ''

        for (let i = 0; i < classNameArr.length; i++) {
            const className = classNameArr[i]
            if (className.startsWith(nameBeginsWith)) {
                foundName = className
                break
            }
        }

        return foundName
    },

    getSameSourceInterpIconTags(tag, typeStr, nameBeginsWith) {
        const scrObjName = otherUtils.getClassName_ByBeginName(
            tag,
            nameBeginsWith
        )

        return scrObjName !== ''
            ? $('img.' + scrObjName).filter('.' + typeStr)
            : tag
    },
}
