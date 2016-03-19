export default () => ({
    tab:  -1,
    tabs: [],

    isReactive: false,
    isTextMode: false,
    isHelpVisible: true,
    isTableVisible: false,
    isSidebarVisible: true,

    subscriptions: {},

    snapshot: {},
    snapshotRequested: false,
    snapshotTimestamp: Date.now()
});
