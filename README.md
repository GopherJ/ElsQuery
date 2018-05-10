# ElsQuery

Elastic Search Query Builder Of Vuejs which is Like [Kibana Query Builder](https://demo.elastic.co/app/kibana#/dashboard/b7be4700-6837-11e7-bd1c-eb5e5ad48f8b) For
Data Visualisation.


## Demo

![](./images/ElsQuery.PNG)


## Environment

- `vue 2.5.13`
- `buefy 0.6.3`


## Installation

```javascript
npm i GopherJ/ElsQuery -S

npm i -S els-query
```


## Usage

`main.js`
```javascript
import Vue from 'vue';
import Vuex from 'vuex';
import ElsQuery from 'ElsQuery';
import Buefy from 'buefy';
import 'buefy/lib/buefy.min.css';

Vue.use(Vuex);
Vue.use(Buefy);

const store = new Vuex.Store();

Vue.use(ElsQuery, {
  store
});
```

`index.html`
```html
<link rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css">
```

`template`
```vue
<els-query @change="(query) => yourMethod(query)" :update-interval="10000"></els-query>
```


## Features

- `Filters`
  - `ADD`
  - `EDIT`
  - `DELETE`
  - `DISABLE, ENABLE`

- `TimeRange`
  - `QUICK`
  - `ABSOLUTE`

- `QueryString`
  - `WILDCARD`

- `AutoRefresh`

## Options

- Props

|key|description|type|default|
|:---|---|---|---|
|`label`|`label of panel`|`String`|`ElsQuery`|
|`filterFactors`|`factors of elastic search`|`Array`|`[]`|
|`filterFields`|`fields of _source`|`Array`|`[{ duration: 'duration' }, { userid: 'user.udid' }, { username: 'user.name' }, { device: 'user.device_info.model' }, { zoneid: 'zone.id' }, { zonename: 'zone.name' }, { zonetags: 'zone.tags' }]`;|
|`filtersOperators`|`operator of a filter`|`Array`|`[{ 'is greater than': 'gt' }, { 'is greater than or equal to': 'gte' }, { 'is less than': 'lt' }, { 'is less than or equal to': 'lte' }, { 'is euqal to': 'is' }, { contains: 'contains' }, { 'is not equal to': 'is not' }, { 'is one of': 'is one of' }, { 'is not one of': 'is not one of' }, { exists: 'exists' }, { 'does not exists': 'does not exists' }]`|
|`updateInterval`|`auto refresh interval`|`Number`|`1000`|

- Events

|name|description|arguments|
|:---|---|---|
|`change`|`query has changed, perhaps caused by active Filters, queryString, dateTimeStart, dateTimeEnd`|`query`|


## Example

![](./images/ElsQuery2.PNG)

```javascript
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "timestamp": {
              "gte": 1522739455974,
              "lte": 1522740355974,
              "format": "epoch_millis"
            }
          }
        },
        {
          "range": {
            "duration": {
              "gte": "asa"
            }
          }
        },
        {
          "bool": {
            "should": [
              {
                "match_phrase": {
                  "zone.id": "sas"
                }
              }
            ],
            "minimum_should_match": 1
          }
        }
      ],
      "must_not": [

      ]
    }
  }
}
```


## Store

`state`
```javascript
this.$store.state.TimeRange.dateTimeStart;
this.$store.state.TimeRange.dateTimeEnd;

this.$store.state.ElsQuery.query;
```

`getters`
```
this.$store.getters['ElsQuery/GET_QUERY'];
```

`mutations`
```javascript
// store module `TimeRange`
this.$store.commit('TimeRange/EDIT_DATE_TIME_START', new Date());
this.$store.commit('TimeRange/EDIT_DATE_TIME_END', new Date());

// store module `ElsQuery`
// this is a mutation internal which means you should avoid to use it directly
this.$store.commit('ElsQuery/EDIT_QUERY', {
    filters,
    queryString,
    dateTimeStart,
    dateTimeEnd
});
```


## ToDO

- `Make TimeRange A Nested Store Module`
- `Separate Filters Component To Elements`


## License
MIT

