
export const dataInfo = {
    minMainBodyWidth: 890,
    minLeftAreaWidth: 650,
    maxMainBodyWidth: 1300,
    maxLeftAreaWidth: 1000,
    rightAreaWidth: 210,
    offSetTotalWidth: 46,
    contentDivOffSet: 45,
    offSetRightAreaPosition: 23,

    interpObjHeight: 400,
    interpObjMaxHeight: 600,
    mapHeight: 308,

    getleftAreaCalcWidth() {
        return $(window).width() - this.rightAreaWidth - this.offSetTotalWidth;
    },
    getInterpDivWidth() {
        return $('.interpretationContainer').width() - this.contentDivOffSet;
    },
};
