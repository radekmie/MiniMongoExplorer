export default () => ({
    tab:  -1,
    tabs: [],

    mode: 0,

    isHelpVisible: true,
    isReactive: false,
    isSidebarVisible: true,
    isTableVisible: false,

    subscriptions: {},

    snapshot: {},
    snapshotRequested: false,
    snapshotTimestamp: Date.now()
});
