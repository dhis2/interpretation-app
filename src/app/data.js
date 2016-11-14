
export const dataInfo = {
    minMainBodyWidth: 890,
    rightAreaWidth: 210,
    offSetWidth: 80,
    getleftAreaWidth() {
        return $(window).width() - this.rightAreaWidth - this.offSetWidth;
    },
};
