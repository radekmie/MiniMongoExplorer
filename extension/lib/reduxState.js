export default () => ({
    tab:  -1,
    tabs: [],

    isHelpView: true,
    isMethodsView: false,
    isReactive: true,
    isSidebarView: true,
    isSubscriptionsView: false,

    mode: 0,

    methods: [],

    snapshot: {},
    snapshotRequested: false,
    snapshotTimestamp: Date.now(),

    subscriptions: {}
});
