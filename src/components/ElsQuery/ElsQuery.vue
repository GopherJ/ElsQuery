<template>
    <b-collapse class="panel" :open.sync="isPanelOpen">
        <!--label of panel-->
        <div slot="trigger" class="panel-heading">
            <div class="level is-mobile">
                <div class="level-left">
                    <strong v-text="label"></strong>
                </div>
                <div class="level-right">
                    <b-icon :icon="isPanelOpen ? 'menu-up' : 'menu-down'"></b-icon>
                </div>
            </div>
        </div>

        <!--filter tags-->
        <div class="panel-block" v-if="filters.length !== 0">
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

        <div class="panel-block">
            <div class="control">
                <div class="columns overflow-auto">
                    <!--filter part-->
                    <b-collapse :open.sync="isFilterOpen" class="column is-narrow">
                        <!--Add a filter button-->
                        <button class="button is-outlined is-primary" slot="trigger">
                            <b-icon :icon=" filterId ? 'pencil' : 'plus'"></b-icon>
                            <span>
                                {{ filterId ? 'Edit a filter' : 'Add a filter' }}
                            </span>
                        </button>

                        <!--filter form-->
                        <b-message class="absolute z-index-30">
                            <label class="label">Filter</label>

                            <div class="field is-grouped level">
                                <!--filter field-->
                                <b-select
                                    placeholder="Add a filter"
                                    v-model="filterFactor"
                                    expanded>
                                    <optgroup
                                        v-if="filterFactors.length !== 0"
                                        label="Node">
                                        <template v-for="filterFactor of filterFactors">
                                            <option
                                                v-for="(value, key) in filterFactor"
                                                v-text="key"
                                                :value="value"
                                                :key="value">
                                            </option>
                                        </template>
                                    </optgroup>
                                    <optgroup
                                        v-if="filterFields.length !== 0"
                                        label="Source">
                                        <template v-for="filterField of filterFields">
                                            <option
                                                v-for="(value, key) in filterField"
                                                v-text="key"
                                                :value="value"
                                                :key="value">
                                            </option>
                                        </template>
                                    </optgroup>
                                </b-select>

                                <!--filter operator-->
                                <b-select
                                    placeholder="Operator"
                                    v-if="filterFactor !== null"
                                    v-model="filterOperator">
                                    <template v-for="filterOperator of filterOperators">
                                        <option
                                            v-for="(value, key) in filterOperator"
                                            v-text="key"
                                            :value="value"
                                            :key="value">
                                        </option>
                                    </template>
                                </b-select>

                                <!--filter value-->
                                <component
                                    v-if="
                                    filterOperator !== null &&
                                    filterOperator !== 'exists' &&
                                    filterOperator !== 'does not exists'"
                                    :is="isMultiValues ? 'b-taginput' : 'b-input'"
                                    :placeholder="isMultiValues ? 'Comma separated' : 'Add a value'"
                                    :confirm-key-codes="isMultiValues ? [188] : false"
                                    @keyup.native.enter="addUpdateFilter"
                                    v-model.trim="filterValue">
                                </component>
                            </div>

                            <!--filter label-->
                            <b-field label="Label">
                                <b-input placeholder="Optional"
                                         v-model.trim="filterLabel"
                                         expanded
                                         @keyup.native.enter="addUpdateFilter">
                                </b-input>
                            </b-field>

                            <!--buttons-->
                            <div class="field is-grouped is-grouped-right">
                                <!--cancel button-->
                                <div class="control">
                                    <button class="button" @click.stop="clearFilter">
                                        Cancel
                                    </button>
                                </div>
                                <!--save button-->
                                <div class="control">
                                    <button class="button is-primary" @click.stop="addUpdateFilter">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </b-message>
                    </b-collapse>

                    <slot></slot>

                    <!--queryString-->
                    <div class="column field has-addons is-marginless">
                        <!--queryString input-->
                        <div class="control is-expanded has-icons-left">
                            <input
                                v-focus class="input is-primary"
                                v-model.trim="queryString"
                                placeholder="e.g. zone.name: tech AND user.device_info.model: m"
                                @keyup.enter="editQuery"/>
                                <span class="icon is-left">
                                    <i class="mdi mdi-magnify mdi-24px"></i>
                                </span>
                        </div>

                        <!--queryString button-->
                        <div class="control">
                            <button class="button is-outlined is-primary"
                                    @click.stop="editQuery">
                                <b-icon icon="magnify"></b-icon>
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <!--time range picker label-->
                    <div class="column is-narrow">
                        <button class="button is-outlined is-primary"
                                @click.stop="isTimeRangeOpen = !isTimeRangeOpen">
                            <b-icon icon="clock"></b-icon>
                            <span>
                                {{ timeRangeLabel }}
                            </span>
                        </button>
                    </div>

                    <!--auto refresh-->
                    <div class="column is-narrow">
                        <button class="button is-outlined is-primary"
                                @click.stop="autoUpdateDateTimeEnd = !autoUpdateDateTimeEnd">
                            <b-icon :icon="autoUpdateDateTimeEnd ? 'eye-off' : 'eye'"></b-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!--time range picker-->
        <div class="panel-block is-paddingless" v-show="isTimeRangeOpen">
            <time-range class="bg-grey control" @tag-click="timeRangeClose"></time-range>
        </div>
    </b-collapse>
</template>

<script>
    /* eslint-disable */
    import {mapMutations, mapState, mapGetters} from 'vuex';
    import moment from 'moment';
    import uuid from 'uuid/v1';
    import { TimeRange } from 'vue-time-range';

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
                isTimeRangeOpen: false,

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
                        {'duration': 'duration'},

                        {'user_id': 'user.udid'},
                        {'user_name': 'user.name'},

                        {'device_model': 'user.device_info.model'},
                        {'device_system': 'user.device_info.system_name'},
                        {'device_system_api': 'user.device_info.system_api_id'},
                        {'device_system_build': 'user.device_info.system_build_number'},
                        {'device_system_version': 'user.device_info.system_version'},

                        {'zone_id': 'zone.id'},
                        {'zone_name': 'zone.name'},
                        {'zone_tags': 'zone.tags'},

                        {'event_title': 'event.title'},
                        {'event_type': 'event.type'},

                        {'latitude': 'location.lat'},
                        {'longitude': 'location.lon'},
                    ];
                },
            },
            filterOperators: {
                type: Array,
                default() {
                    return [
                        {'is greater than': 'gt'},
                        {'is greater than or equal to': 'gte'},
                        {'is less than': 'lt'},
                        {'is less than or equal to': 'lte'},
                        {'is equal to': 'is'},
                        {'contains': 'contains'},
                        {'is not equal to': 'is not'},
                        {'is one of': 'is one of'},
                        {'is not one of': 'is not one of'},
                        {'exists': 'exists'},
                        {'does not exists': 'does not exists'},
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
                const {factor, operator, value} = filter.entry;

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

                if (!filterFactor || !filterOperator || !['exists', 'does not exists'].includes(filterOperator) && filterValue === null) {
                    return;
                }

                const text = ['exists', 'does not exists'].includes(filterOperator)
                    ? `${filterFactor} ${filterOperator}`
                    : `${filterFactor} ${filterOperator} ${filterValue}`;

                const entry = ['exists', 'does not exists'].includes(filterOperator)
                    ? {factor: filterFactor, operator: filterOperator}
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
                        this.interval = window.setInterval(() => {
                            this.EDIT_DATE_TIME_END(new Date());
                        }, this.updateInterval);
                    } else {
                        window.clearInterval(this.interval);
                    }
                }
            }
        },
        components: {
            [TimeRange.name]: TimeRange,
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
            ]), function (n, o) {
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
            });
        },
        beforeDestroy() {
            this.unwatch();
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

    .bg-grey {
        background-color: #f5f5f5;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .overflow-auto {
        overflow: auto;
    }
</style>

<style>
    .message-body {
        border-width: 1px;
    }
</style>

