<template>
    <u-card class="u-els-query" :label="$t('UAnalytics.queryBuilder.label')">

        <div class="u-card-tabs" v-if="filters.length !== 0">
            <div class="field is-grouped is-grouped-multiline">
                <div class="control" v-for="(filter, index) of filters" :key="filter.id">
                    <b-taglist attached>
                        <b-tag
                            class="cursor-pointer"
                            type="is-primary"
                            attached
                            @click.native.stop="editFilter(filter)">
                            {{ filter.label }}
                        </b-tag>
                        <b-tag
                            class="cursor-pointer"
                            :type="filter.isActive ? 'is-success' : 'is-light'"
                            @click.native.stop="$set(filter, 'isActive', !(filter.isActive))"
                            closable
                            @close="filters.splice(index, 1)">
                            {{ filter.isActive ? 'active' : 'inactive' }}
                        </b-tag>
                    </b-taglist>
                </div>
            </div>
        </div>

        <div class="u-card-block">
            <section style="padding: 1.5rem;">
                <div class="columns overflow-auto is-multiline">
                    <b-collapse :open.sync="isFilterOpen" class="column is-narrow">
                        <button class="button is-outlined is-primary" slot="trigger">
                            <b-icon :icon=" filterId ? 'pencil' : 'plus'"></b-icon>
                            <span>{{ filterId ? 'Edit a filter' : 'Add a filter' }}</span>
                        </button>

                        <b-message class="absolute z-index-30" v-show="isFilterOpen">
                            <b-field label="Filter">
                                <b-field grouped>
                                    <b-select
                                        placeholder="Add a filter"
                                        v-model="filterFactor"
                                        expanded>
                                        <optgroup
                                            v-if="filterFactors.length !== 0"
                                            label="Node">
                                            <option
                                                v-for="factor of filterFactors"
                                                v-text="factor.key"
                                                :value="factor.value"
                                                :key="factor.value">
                                            </option>
                                        </optgroup>
                                        <optgroup
                                            v-if="filterFields.length"
                                            label="Source">
                                            <option
                                                v-for="field of filterFields"
                                                v-text="field.key"
                                                :value="field.value"
                                                :key="field.value">
                                            </option>
                                        </optgroup>
                                    </b-select>

                                    <b-select
                                        placeholder="Operator"
                                        v-if="filterFactor !== null"
                                        v-model="filterOperator">
                                        <option
                                            v-for="operator of filterOperators"
                                            v-text="operator.key"
                                            :value="operator.value"
                                            :key="operator.value">
                                        </option>
                                    </b-select>

                                    <component
                                        v-if="
                                            filterOperator !== null &&
                                            filterOperator !== 'exists' &&
                                            filterOperator !== 'does not exists'"
                                        :is="isMultiValues ? 'b-taginput' : 'b-input'"
                                        :title="isMultiValues ? 'Hit comma to enter another value' : null"
                                        :placeholder="isMultiValues ? 'Comma separated' : 'Add a value'"
                                        :confirm-key-codes="isMultiValues ? [188] : false"
                                        @keyup.native.enter="addUpdateFilter"
                                        v-model.trim="filterValue">
                                    </component>
                                </b-field>
                            </b-field>

                            <b-field label="Label">
                                <b-input
                                     placeholder="Optional"
                                     v-model.trim="filterLabel"
                                     expanded
                                     @keyup.native.enter="addUpdateFilter">
                                </b-input>
                            </b-field>

                            <b-field grouped position="is-right">
                                <button class="control button" @click.stop="clearFilter">Cancel</button>
                                <button class="control button is-primary" @click.stop="addUpdateFilter">Save</button>
                            </b-field>
                        </b-message>
                    </b-collapse>

                    <div class="column field has-addons is-marginless">
                        <div class="control is-expanded has-icons-left">
                            <input
                                v-focus
                                class="input is-primary"
                                v-model.trim="queryString"
                                placeholder="e.g. zone.name: tech AND user.device_info.model: m"
                                @keyup.enter="editQuery"/>
                            <span class="icon is-left">
                                <i class="mdi mdi-magnify mdi-24px"></i>
                            </span>
                        </div>

                        <div class="control">
                            <button
                                class="button is-outlined is-primary"
                                @click.stop="editQuery">
                                <b-icon icon="magnify"/>
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div class="column is-narrow">
                        <button
                            class="button is-outlined is-primary"
                            @click.stop="isTimeRangeOpen = !isTimeRangeOpen">
                            <b-icon icon="clock"/>
                            <span>{{ timeRangeLabel }}</span>
                        </button>
                    </div>

                    <div class="column is-narrow">
                        <button
                            class="button is-outlined is-primary"
                            @click.stop="autoUpdateDateTimeEnd = !autoUpdateDateTimeEnd">
                            <b-icon :icon="autoUpdateDateTimeEnd ? 'eye-off' : 'eye'"/>
                        </button>
                    </div>
                </div>
            </section>
        </div>

        <div class="u-card-block" v-show="isTimeRangeOpen">
            <time-range @tag-click="timeRangeClose"></time-range>
        </div>
    </u-card>
</template>

<script>
    /* eslint-disable */
    import {mapMutations, mapState, mapGetters} from 'vuex';
    import moment from 'moment';
    import uuid from 'uuid/v1';
    import {TimeRange} from 'vue-time-range';
    import UCard from '../UCard';
    import {debounce, cloneDeep} from 'lodash';
    import Interval from '../../utils/interval';

    const FindIndex = (arr, key, value) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] === value) {
                return i;
            }
        }
        return -1;
    };

    const NotExistsExcept = (arr, key, value, index) => {
        for (let i = 0; i < arr.length; i += 1) {
            if (i !== index && arr[i][key] === value) {
                return false;
            }
        }

        return true;
    };

    const NotExists = (arr, key, value) => FindIndex(arr, key, value) === -1;

    export default {
        name: 'els-query',
        data() {
            return {
                isPanelOpen: true,
                isFilterOpen: false,
                isTimeRangeOpen: true,

                filterId: null,
                filterIsActive: null,

                filterLabel: null,

                filterFactor: null,
                filterOperator: null,
                filterValue: null,

                filters: [],
                queryString: null,

                autoUpdateDateTimeEnd: false,
            };
        },
        props: {
            label: {
                type: String,
                default: 'ElsQuery',
            },
            updateInterval: {
                type: Number,
                default: 1000,
            },
            filterFactors: {
                type: Array,
                default() {
                    return [];
                },
            },
            filterFields: {
                type: Array,
                default() {
                    return [
                        { key: 'duration', value: 'duration' },

                        { key: 'user_id', value: 'user.udid' },
                        { key: 'user_tags', value: 'user.tags' },
                        { key: 'user_name', value: 'user.name' },

                        { key: 'device_model', value: 'user.device_info.model' },
                        { key: 'device_system', value: 'user.device_info.system_name' },
                        { key: 'device_system_api', value: 'user.device_info.system_api_id' },
                        { key: 'device_system_build', value: 'user.device_info.system_build_number' },
                        { key: 'device_system_version', value: 'user.device_info.system_version' },

                        { key: 'zone_id', value: 'zone.id' },
                        { key: 'zone_name', value: 'zone.name' },
                        { key: 'zone_tags', value: 'zone.tags' },

                        { key: 'event_title', value: 'event.title' },
                        { key: 'event_type', value: 'event.type' },
                        { key: 'event_style', value: 'event.style' },
                    ];
                },
            },
            filterOperators: {
                type: Array,
                default() {
                    return [
                        { key: 'is greater than', value: 'gt'},
                        { key: 'is greater than or equal to', value: 'gte'},
                        { key: 'is less than', value: 'lt'},
                        { key: 'is less than or equal to', value: 'lte'},
                        { key: 'is equal to', value: 'is'},
                        { key: 'is not equal to', value: 'is not'},
                        { key: 'is one of', value: 'is one of'},
                        { key: 'is not one of', value: 'is not one of'},
                        { key: 'exists', value: 'exists'},
                        { key: 'does not exists', value: 'does not exists'},
                        { key: 'contains', value: 'contains'},
                    ];
                },
            },
        },
        methods: {
            ...mapMutations('ElsQuery', [
                'EDIT_QUERY',
            ]),
            ...mapMutations('TimeRange', [
                'EDIT_DATE_TIME_END'
            ]),
            clearFilter() {
                this.filterFactor = null;
                this.filterOperator = null;
                this.filterValue = null;
                this.filterLabel = null;

                this.filterId = null;
                this.filterIsActive = null;

                this.isFilterOpen = false;
            },
            timeRangeClose() {
                this.isTimeRangeOpen = false;
            },
            editQuery() {
                this.EDIT_QUERY({
                    filters: this.activeFilters,
                    dateTimeStart: this.dateTimeStart,
                    dateTimeEnd: this.dateTimeEnd,
                    queryString: this.queryString,
                });
                this.$emit('change', this.GET_QUERY);
            },
            warningFilterLabelExists() {
                this.$snackbar.open({
                    message: 'The label of this filter already exists!',
                    type: 'is-warning',
                    position: 'is-top',
                });
            },
            warningFilterExists() {
                this.$snackbar.open({
                    message: 'This filter already exists!',
                    type: 'is-danger',
                    position: 'is-top',
                });
            },
            editFilter(filter) {
                const {id, label, isActive} = filter;
                const {factor, operator, value} = cloneDeep(filter.entry);

                this.isFilterOpen = true;

                this.filterFactor = factor;
                this.filterOperator = operator;
                this.filterValue = value;

                this.filterLabel = label;

                this.filterId = id;
                this.filterIsActive = isActive;
            },
            addUpdateFilter() {
                const filterFactor = this.filterFactor;
                const filterOperator = this.filterOperator;
                const filterValue = this.filterValue;

                const filterLabel = this.filterLabel;

                const filterId = this.filterId;
                const filterIsActive = this.filterIsActive;

                const filters = this.filters;

                if (
                    !filterFactor
                    || !filterOperator
                    || (!['exists', 'does not exists'].includes(filterOperator) && !filterValue)
                    || (['is one of', 'is not one of'].includes(filterOperator) && !filterValue.length)
                ) {
                    return;
                }

                const text = ['exists', 'does not exists'].includes(filterOperator)
                    ? `${filterFactor} ${filterOperator}`
                    : `${filterFactor} ${filterOperator} ${filterValue}`;

                const entry = ['exists', 'does not exists'].includes(filterOperator)
                    ? {factor: filterFactor, operator: filterOperator}
                    : ['is none of', 'is not one of'].includes(filterOperator)
                    ? {
                        factor: filterFactor,
                        operator: filterOperator,
                        value: filterValue.map(x => isNaN(+x) ? x : +x)
                    }
                    : {
                        factor: filterFactor,
                        operator: filterOperator,
                        value: isNaN(+filterValue) ? filterValue : +filterValue
                    };

                const id = filterId || uuid();

                const label = filterLabel || text;

                const filter = {
                    id,
                    label,
                    text,
                    isActive: filterIsActive !== null ? filterIsActive : true,
                    entry,
                };

                if (NotExists(filters, 'id', filter.id)) {
                    if (NotExists(filters, 'text', filter.text)) {
                        if (NotExists(filters, 'label', filter.label)) {
                            filters.push(filter);
                        } else {
                            this.warningFilterLabelExists();
                        }
                    } else {
                        this.warningFilterExists();
                    }
                } else {
                    const index = FindIndex(filters, 'id', filter.id);

                    if (NotExistsExcept(filters, 'text', filter.text, index)) {
                        if (NotExistsExcept(filters, 'label', filter.label, index)) {
                            filters.splice(index, 1, filter);
                        } else {
                            this.warningFilterLabelExists();
                        }
                    } else {
                        this.warningFilterExists();
                    }
                }

                this.clearFilter();
            },
        },
        computed: {
            ...mapState('TimeRange', [
                'dateTimeStart',
                'dateTimeEnd',
            ]),
            ...mapGetters('ElsQuery', [
                'GET_QUERY',
            ]),
            activeFilters() {
                return this.filters.filter(el => el.isActive);
            },
            timeRangeLabel: {
                get() {
                    const dateTimeStart = this.dateTimeStart;
                    const dateTimeEnd = this.dateTimeEnd;
                    const FORMAT = 'YYYY-MM-DD HH:mm:ss';

                    return `From ${moment(dateTimeStart).format(FORMAT)} To ${moment(dateTimeEnd).format(FORMAT)}`;
                },
            },
            isMultiValues: {
                get() {
                    return ['is one of', 'is not one of'].includes(this.filterOperator);
                },
            },
        },
        directives: {
            focus: {
                inserted(el) {
                    el.focus();
                },
            },
        },
        watch: {
            filterOperator: {
                handler(n, o) {
                    if (!(['is one of', 'is not one of'].includes(o)) && ['is one of', 'is not one of'].includes(n) && o !== null) {
                        this.filterValue = [];
                    }
                },
            },
            autoUpdateDateTimeEnd: {
                handler(n) {
                    if (n) {
                        this.interval = new Interval(() => {
                            this.EDIT_DATE_TIME_END(new Date());
                        }, this.updateInterval);

                        this.interval.start();
                    } else {
                        this.interval.stop()
                    }
                }
            }
        },
        components: {
            [TimeRange.name]: TimeRange,
            [UCard.name]: UCard
        },
        mounted() {
            // initialisation
            this.EDIT_QUERY({
                dateTimeStart: this.dateTimeStart,
                dateTimeEnd: this.dateTimeEnd,
                filters: this.activeFilters,
                queryString: this.queryString,
            });

            // watch time range and filters
            this.unwatch = this.$watch(vm => JSON.stringify([
                vm.dateTimeStart.valueOf(),
                vm.dateTimeEnd.valueOf(),
                vm.activeFilters,
            ]), debounce((n, o) => {
                const dateTimeEnd = this.dateTimeEnd;
                const dateTimeStart = this.dateTimeStart;

                const filters = this.activeFilters;
                const queryString = this.queryString;

                const payload = {
                    dateTimeStart,
                    dateTimeEnd,
                    filters,
                    queryString,
                };

                this.EDIT_QUERY(payload);
                this.$emit('change', this.GET_QUERY);
            }, 250));
        },
        beforeDestroy() {
            this.unwatch();

            if (this.interval && this.interval.isRunning()) this.interval.stop();
        }
    };
</script>

<style scoped>
    .absolute {
        position: absolute;
    }

    .z-index-30 {
        z-index: 30;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .oveflow-auto {
        overflow: auto;
    }
</style>

<style>
    .message-body {
        border-width: 1px !important;
    }
</style>
