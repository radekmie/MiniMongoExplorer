export default () => ({
    tab:  -1,
    tabs: [],

    isHelpView: true,
    isMethodsView: false,
    isReactive: false,
    isSidebarView: true,
    isSubscriptionsView: false,

    mode: 0,

    methods: [],

    snapshot: {},
    snapshotRequested: false,
    snapshotTimestamp: Date.now(),

    subscriptions: {}
});
