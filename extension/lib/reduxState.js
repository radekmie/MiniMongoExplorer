export default () => ({
    tab:  -1,
    tabs: [],

    isReactive: false,
    isTextMode: false,
    isHelpVisible: true,
    isSidebarVisible: true,

    snapshot: {},
    snapshotRequested: false,
    snapshotTimestamp: Date.now()
});
