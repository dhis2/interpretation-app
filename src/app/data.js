
export const dataInfo = {
    minMainBodyWidth: 890,
    rightAreaWidth: 210,
    offSetWidth: 46,
    contentDivOffSet: 20,
    getleftAreaCalcWidth() {
        return $(window).width() - this.rightAreaWidth - this.offSetWidth;
    },
    getInterpDivWidth() {
        return $('.intpreContents').width() - this.contentDivOffSet;
    },
};
