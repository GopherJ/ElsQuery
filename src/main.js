/* eslint-disable */
import ElsQuery from './components/ElsQuery';
import ElsQueryStore from './store/ElsQueryStore';
import { TimeRange, TimeRangeStore } from 'vue-time-range';

const install = (Vue, options = {}) => {
    if (options.store) {
        options.store.registerModule('ElsQuery', ElsQueryStore);
        options.store.registerModule('TimeRange', TimeRangeStore);
    }

    Vue.component(TimeRange.name, TimeRange);
    Vue.component(ElsQuery.name, ElsQuery);
};

export default {
    install
};

export {
    ElsQuery,
    ElsQueryStore
};

