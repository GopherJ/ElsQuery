/* eslint-disable */
import ElsQuery from './components/ElsQuery';
import ElsQueryStore from './store/ElsQuery';

import TimeRange from './components/TimeRange';
import TimeRangeStore from './store/TimeRange';

const install = (Vue, options = {}) => {
    if (options.store) {
        options.store.registerModule('TimeRange', TimeRangeStore);
        options.store.registerModule('ElsQuery', ElsQueryStore);
    }

    Vue.component(ElsQuery.name, ElsQuery);
};

export default {
    install,

    ElsQuery,
    ElsQueryStore,

    TimeRange,
    TimeRangeStore
};

