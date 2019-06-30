/* eslint-disable */
import { cloneDeep } from 'lodash';

const namespaced = true;

const state = {
    _query: {
        query: {
            bool: {
                must: [
                    {
                        range: {
                            timestamp: {},
                        },
                    },
                ],
                must_not: [],
            },
        },
    },
    query: {
        query: {
            bool: {
                must: [
                    {
                        range: {
                            timestamp: {
                                gte: new Date(new Date().valueOf() - 15 * 60 * 1000).valueOf(),
                                lte: new Date().valueOf()
                            },
                        },
                    },
                ],
                must_not: [],
            },
        },
    },
};

const mutations = {
    EDIT_QUERY({_query}, {filters, queryString, dateTimeStart, dateTimeEnd}) {
        const query = cloneDeep(_query);

        const must = query.query.bool.must;
        const must_not = query.query.bool.must_not;

        // 1. queryString
        if (queryString) {
            must.push({
                query_string: {
                    query: queryString,
                    analyze_wildcard: true,
                },
            });
        }

        // 2. dateTimeStart, dateTimeEnd
        for (const el of must) {
            if (el.range && el.range.timestamp) {
                const {timestamp} = el.range;

                timestamp.gte = dateTimeStart.valueOf();
                timestamp.lte = dateTimeEnd.valueOf();
                timestamp.format = 'epoch_millis';
            }
        }

        // 3. activeFilters
        for (let i = 0; i < filters.length; i += 1) {
            const {factor, operator, value} = filters[i].entry;

            if (['gt', 'gte', 'lt', 'lte'].includes(operator)) {
                must.push({
                    range: {
                        [factor]: {
                            [operator]: value,
                        },
                    },
                });
            } else if (['is not', 'is'].includes(operator)) {
                switch (operator) {
                    case 'is':
                        must.push({
                            match_phrase: {
                                [factor]: value,
                            },
                        });
                        break;
                    case 'is not':
                        must_not.push({
                            match_phrase: {
                                [factor]: value,
                            },
                        });
                        break;
                }
            } else if (['exists', 'does not exists'].includes(operator)) {
                switch (operator) {
                    case 'exists':
                        must.push({
                            exists: {
                                field: factor,
                            },
                        });
                        break;
                    case 'does not exists':
                        must_not.push({
                            exists: {
                                field: factor,
                            },
                        });
                        break;
                }
            } else if (['is one of', 'is not one of'].includes(operator)) {
                switch (operator) {
                    case 'is one of':
                        must.push({
                            bool: {
                                should: value.map(el => ({match_phrase: {[factor]: el}})),
                                minimum_should_match: 1,
                            },
                        });
                        break;
                    case 'is not one of':
                        must_not.push({
                            bool: {
                                should: value.map(el => ({match_phrase: {[factor]: el}})),
                                minimum_should_match: 1
                            }
                        });
                        break;
                }
            } else if (operator === 'contains') {
                must.push({
                    wildcard: {
                        [factor]: '*' + value + '*',
                    },
                });
            } else if (operator === 'not contains') {
                must_not.push({
                    wildcard: {
                        [factor]: '*' + value + '*',
                    },
                });
            }
        }

        state.query = query;
    },
};

const getters = {
    GET_QUERY({query}) {
        return query;
    },
    GET_QUERY_BASE({_query}) {
        return _query;
    },
};

export default {
    namespaced,
    state,
    getters,
    mutations,
};
