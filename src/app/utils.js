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
