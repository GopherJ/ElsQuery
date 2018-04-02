<template>
    <!-- eslint-disable -->
    <b-collapse class="panel" :open.sync="isOpen">
        <div slot="trigger" class="panel-heading" v-if="labelPanel !== null">
            <strong>
                {{ labelPanel }}
                <span class="subtitle" v-html="subtitle"></span>
            </strong>
        </div>

        <div :class="{ 'panel-block': !!labelPanel}">
            <section class="section" :class="{ 'control' : !!labelPanel }">
                <div class="container is-fluid min-height">
                    <div class="columns">
                        <!--mode buttons-->
                        <div class="column is-one-fifth">
                            <div class="field">
                                <button class="button is-outlined is-primary" @click.stop="modeQuick">Quick</button>
                            </div>
                            <div class="field">
                                <button
                                    class="button is-outlined is-primary"
                                    @click.stop="modeAbsolute">
                                    Absolute
                                </button>
                            </div>
                        </div>

                        <!--dateTimeStart picker container-->
                        <div class="column is-two-fifths" v-show="mode === 'absolute'">
                            <!--dateTimeStart picker label-->
                            <div class="level">
                                <div class="level-left">
                                    <label for="b-datepicker-start"
                                           class="cursor-pointer label tag is-primary is-medium"
                                           v-text="labelStart">
                                    </label>
                                </div>
                                <div class="level-right subtitle">
                                    <button class="button is-light" @click.stop="setToNowStart">Set To Now</button>
                                </div>
                            </div>

                            <!--dateTimeStart picker-->
                            <div class="columns field has-addons is-gapless">
                                <b-datepicker
                                    v-model="SD"
                                    id="b-datepicker-start"
                                    icon="calendar-today"
                                    class="control column is-three-fifths"
                                    indicators="dots"
                                    :events="eventsStart"
                                    :max-date="maxDate"
                                    rounded>
                                </b-datepicker>
                                <b-timepicker
                                    v-model="ST"
                                    icon="clock"
                                    :readonly="false"
                                    class="control column is-two-fifths"
                                    :max-time="maxTime"
                                    rounded
                                    hour-format="24">
                                </b-timepicker>
                            </div>

                        </div>
                        <div class="column is-two-fifths" v-show="mode === 'absolute'">
                            <!--dateTimeEnd picker label-->
                            <div class="level">
                                <div class="level-left">
                                    <label for="b-datepicker-end"
                                           class="cursor-pointer label tag is-primary is-medium"
                                           v-text="labelEnd">
                                    </label>
                                </div>
                                <div class="level-right subtitle">
                                    <button class="button is-light" @click.stop="setToNowEnd">Set To Now</button>
                                </div>
                            </div>

                            <!--dateTimeEnd picker-->
                            <div class="columns field has-addons is-gapless">
                                <b-datepicker
                                    v-model="ED"
                                    icon="calendar-today"
                                    id="b-datepicker-end"
                                    class="control column is-three-fifths"
                                    indicators="dots"
                                    :events="eventsEnd"
                                    :min-date="minDate"
                                    rounded>
                                </b-datepicker>
                                <b-timepicker
                                    v-model="ET"
                                    icon="clock"
                                    :readonly="false"
                                    class="control column is-two-fifths"
                                    rounded
                                    :min-time="minTime"
                                    hour-format="24">
                                </b-timepicker>
                            </div>

                        </div>

                        <!--mode quick tags-->
                        <div class="column is-four-fifths" v-show="mode === 'quick'">
                            <b-taglist>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_THISDAYSOFAR(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    This day so far
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_TODAY(); modeAbsolute(); fold(); $emit('tagClicked');">Today
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_YESTERDAY(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Yesterday
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_THISWEEK(); modeAbsolute(); fold(); $emit('tagClicked');">This
                                    week
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_THISMONTH(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    This month
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_THISYEAR(); modeAbsolute(); fold(); $emit('tagClicked');">This
                                    year
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_WEEKTODATE(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Week to date
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_MONTHTODATE(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Month to date
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_YEARTODATE(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Year to date
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST15MINUTES(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 15 minutes
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST30MINUTES(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 30 minutes
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST45MINUTES(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 45 minutes
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST1HOUR(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 1 hour
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST4HOURS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 4 hours
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST12HOURS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 12 hours
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST24HOURS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 24 hours
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST7DAYS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 7 days
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST30DAYS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 30 days
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST60DAYS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 60 days
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST90DAYS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 90 days
                                </button>

                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST6MONTHS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 6 months
                                </button>

                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST1YEAR(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 1 year
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST2YEARS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 2 years
                                </button>
                                <button class="tag is-outlined is-primary button"
                                        @click.stop="EDIT_LAST5YEARS(); modeAbsolute(); fold(); $emit('tagClicked');">
                                    Last 5 years
                                </button>
                            </b-taglist>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    </b-collapse>
</template>

<script>
/* eslint-disable */
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import moment from 'moment';

    const RANDOM_COLOR = () => {
        const colors = [
            'is-info',
            'is-danger',
            'is-success',
            'is-link',
            'is-warning',
            'is-info',
        ];

        return colors[Math.floor(Math.random() * colors.length)];
    };

    const SHORT_HANDS = {
        EDIT_LAST15MINUTES: 'Last 15 minutes',
        EDIT_LAST30MINUTES: 'Last 30 minutes',
        EDIT_LAST45MINUTES: 'Last 45 minutes',
        EDIT_LAST1HOUR: 'Last 1 hour',
        EDIT_LAST4HOURS: 'Last 4 hours',
        EDIT_LAST12HOURS: 'Last 12 hours',
        EDIT_LAST24HOURS: 'Last 24 hours',
        EDIT_LAST7DAYS: 'Last 7 days',
        EDIT_LAST30DAYS: 'Last 30 days',
        EDIT_LAST60DAYS: 'Last 60 days',
        EDIT_LAST90DAYS: 'Last 90 days',
        EDIT_LAST6MONTHS: 'Last 6 months',
        EDIT_LAST1YEAR: 'Last 1 year',
        EDIT_LAST2YEARS: 'Last 2 years',
        EDIT_LAST5YEARS: 'Last 5 years',
        EDIT_THISDAYSOFAR: 'This day so far',
        EDIT_TODAY: 'Today',
        EDIT_YESTERDAY: 'Yesterday',
        EDIT_THISWEEK: 'This week',
        EDIT_THISMONTH: 'This month',
        EDIT_THISYEAR: 'This year',
        EDIT_WEEKTODATE: 'Week to date',
        EDIT_MONTHTODATE: 'Month to date',
        EDIT_YEARTODATE: 'Year to date',
    };


    export default {
        name: 'time-range',
        data() {
            return {
                eventsStart: [],
                eventsEnd: [],
                mode: 'absolute',
                tags: SHORT_HANDS,
                isOpen: true,
            };
        },
        props: {
            labelStart: {
                type: String,
                default: () => ('From'),
            },
            labelEnd: {
                type: String,
                default: () => ('To'),
            },
            labelPanel: {
                type: String,
                default: () => (null),
            },
            autoFold: {
                type: Boolean,
                default: () => (false),
            },
        },
        watch: {
            ED(n) {
                const timeStampOfDay = 24 * 60 * 60 * 1000;

                const timeStampEnd = new Date(
                    n.getFullYear(),
                    n.getMonth(),
                    n.getDate(),
                ).valueOf();

                const timeStampStart = new Date(
                    this.dateTimeStart.getFullYear(),
                    this.dateTimeStart.getMonth(),
                    this.dateTimeStart.getDate(),
                ).valueOf();

                const arr = [];
                for (let i = timeStampStart; i <= timeStampEnd; i += timeStampOfDay) {
                    arr.push({
                        date: new Date(i),
                        type: RANDOM_COLOR(),
                    });
                }
                this.eventsStart = arr;
                this.eventsEnd = arr;
            },
            SD(n) {
                const timeStampOfDay = 24 * 60 * 60 * 1000;

                const timeStampStart = new Date(
                    n.getFullYear(),
                    n.getMonth(),
                    n.getDate(),
                ).valueOf();

                const timeStampEnd = new Date(
                    this.dateTimeEnd.getFullYear(),
                    this.dateTimeEnd.getMonth(),
                    this.dateTimeEnd.getDate(),
                ).valueOf();

                const arr = [];
                for (let i = timeStampStart; i <= timeStampEnd; i += timeStampOfDay) {
                    arr.push({
                        date: new Date(i),
                        type: RANDOM_COLOR(),
                    });
                }

                this.eventsStart = arr;
                this.eventsEnd = arr;
            },
        },
        methods: {
            ...mapMutations('TimeRange', [
                'EDIT_DATE_TIME_START',
                'EDIT_DATE_TIME_END',
                ...Object.keys(SHORT_HANDS),
            ]),
            modeQuick() {
                this.mode = 'quick';
            },
            setToNowStart() {
                const date = new Date();
                this.EDIT_DATE_TIME_START(new Date(date.valueOf() - 1000 * 15 * 60));
            },
            setToNowEnd() {
                this.EDIT_DATE_TIME_END(new Date());
            },
            modeAbsolute() {
                this.mode = 'absolute';
            },
            fold() {
                const autoFold = this.autoFold;

                if (autoFold) {
                    this.isOpen = false;
                }
            },
            warningStart() {
                this.$snackbar.open({
                    message: 'The time start must be smaller than the time end in this situation',
                    type: 'is-warning',
                    position: 'is-top',
                });
            },
            warningEnd() {
                this.$snackbar.open({
                    message: 'The time end must be larger than the time start in this situation',
                    type: 'is-warning',
                    position: 'is-top',
                });
            },
        },
        computed: {
            ...mapState('TimeRange', [
                'dateTimeStart',
                'dateTimeEnd',
            ]),
            ...mapGetters('TimeRange', [
                'hourStart',
                'minuteStart',
                'secondStart',
                'yearStart',
                'monthStart',
                'dayStart',
                'hourEnd',
                'minuteEnd',
                'secondEnd',
                'yearEnd',
                'monthEnd',
                'dayEnd',
            ]),
            subtitle: {
                get() {
                    const dateTimeStart = this.dateTimeStart;
                    const dateTimeEnd = this.dateTimeEnd;
                    const FORMAT = 'YYYY-MM-DD HH:mm:ss';

                    return `From ${moment(dateTimeStart).format(FORMAT)} To ${moment(dateTimeEnd).format(FORMAT)}`;
                },
            },
            SD: {
                get() {
                    return this.dateTimeStart;
                },
                set(n) {
                    const y = n.getFullYear();
                    const m = n.getMonth();
                    const d = n.getDate();

                    if (
                        y === this.yearStart &&
                        m === this.monthStart &&
                        d === this.dayStart
                    ) {
                        return;
                    }

                    this.EDIT_DATE_TIME_START(
                        new Date(
                            y,
                            m,
                            d,
                            this.hourStart,
                            this.minuteStart,
                            0),
                    );
                },
            },
            ST: {
                get() {
                    return this.dateTimeStart;
                },
                set(n) {
                    const h = n.getHours();
                    const m = n.getMinutes();

                    if (
                        h === this.hourStart &&
                        m === this.minuteStart
                    ) {
                        return;
                    }

                    if (
                        this.yearStart === this.yearEnd &&
                        this.monthStart === this.monthEnd &&
                        this.dayStart === this.dayEnd
                    ) {
                        if (h > this.hourEnd || (h === this.hourEnd && m > this.minuteEnd)) {
                            this.warningStart();
                        } else {
                            this.EDIT_DATE_TIME_START(
                                new Date(
                                    this.yearStart,
                                    this.monthStart,
                                    this.dayStart,
                                    h,
                                    m,
                                    0,
                                ),
                            );
                        }
                    }
                },
            },
            ED: {
                get() {
                    return this.dateTimeEnd;
                },
                set(n) {
                    const y = n.getFullYear();
                    const m = n.getMonth();
                    const d = n.getDate();

                    if (
                        y === this.yearEnd &&
                        m === this.monthEnd &&
                        d === this.dayEnd
                    ) {
                        return;
                    }

                    this.EDIT_DATE_TIME_END(
                        new Date(
                            y,
                            m,
                            d,
                            this.hourEnd,
                            this.minuteEnd,
                            0),
                    );
                },
            },
            ET: {
                get() {
                    return this.dateTimeEnd;
                },
                set(n) {
                    const h = n.getHours();
                    const m = n.getMinutes();

                    if (
                        h === this.hourEnd &&
                        m === this.minuteEnd
                    ) {
                        return;
                    }

                    if (
                        this.yearStart === this.yearEnd &&
                        this.monthStart === this.monthEnd &&
                        this.dayStart === this.dayEnd
                    ) {
                        if (h < this.hourStart || (h === this.hourStart && m < this.minuteStart)) {
                            this.warningEnd();
                        } else {
                            this.EDIT_DATE_TIME_END(
                                new Date(
                                    this.yearEnd,
                                    this.monthEnd,
                                    this.dayEnd,
                                    h,
                                    m,
                                    0,
                                ),
                            );
                        }
                    }
                },
            },
            minDate() {
                return new Date(
                    this.yearStart,
                    this.monthStart,
                    this.dayStart - 1,
                    this.hourStart,
                    this.minuteStart,
                    0,
                );
            },
            minTime() {
                if (
                    this.yearStart === this.yearEnd &&
                    this.monthStart === this.monthEnd &&
                    this.dayStart === this.dayEnd
                ) {
                    return new Date(
                        this.yearStart,
                        this.monthStart,
                        this.dayStart,
                        this.hourStart,
                        this.minuteStart,
                        0,
                    );
                }
            },
            maxDate() {
                return new Date(
                    this.yearEnd,
                    this.monthEnd,
                    this.dayEnd,
                    this.hourEnd,
                    this.minuteEnd,
                    0,
                );
            },
            maxTime() {
                if (
                    this.yearStart === this.yearEnd &&
                    this.monthStart === this.monthEnd &&
                    this.dayStart === this.dayEnd
                ) {
                    return new Date(
                        this.yearEnd,
                        this.monthEnd,
                        this.dayEnd,
                        this.hourEnd,
                        this.minuteEnd,
                        0,
                    );
                }
            },

        },
        mounted() {
            this.$watch(vm => [
                vm.dateTimeStart.valueOf(),
                vm.dateTimeEnd.valueOf()
            ].join('-'), function (n, o) {
                const TimeRangeOld = o.split('-')
                    .map(el => Number.parseInt(el, 10))
                    .map(timestamp => new Date(timestamp));

                const TimeRangeNew = n.split('-')
                    .map(el => Number.parseInt(el, 10))
                    .map(timestamp => new Date(timestamp));

                this.$emit('timeRangeChange', TimeRangeNew, TimeRangeOld);
            });
        }
    };
</script>

<style scoped>
    .min-height {
        min-height: 8rem;
    }

    .subtitle {
        font-weight: 400;
        font-size: 0.75rem;
        opacity: .75;
    }

    .cursor-pointer {
        cursor: pointer;
    }
</style>
