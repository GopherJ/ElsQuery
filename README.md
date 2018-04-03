# ElsQuery

Vue Elastic Search Query Builder Like [kibana](https://demo.elastic.co/app/kibana#/dashboard/b7be4700-6837-11e7-bd1c-eb5e5ad48f8b)


## Environment

- vue 2.5.13
- buefy 0.6.3


## Installation

```javascript
npm i GopherJ/ElsQuery -S
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
<els-query @change="(query) => yourMethod(query)"></els-query>
```


## Demo

![](./images/ElsQuery.PNG)


## Features

- Filters
  - `ADD`
  - `EDIT`
  - `DELETE`
  - `DISABLE`
- TimeRange
  - `QUIK`
  - `ABSOLUTE`
- queryString
  - `WILDCARD`

> Every time you've changed `Filters`, `TimeRange` or `queryString`, you can get the new query in `yourMethod`!


## Options

- Props

|key|description|type|default|
|:---|---|---|---|
| label|label of panel|String|ElsQuery|
| filterFactors|factors of elasticsearch|Array|[]|
| filterFields|fields of _source|Array|[{ duration: 'duration' }, { userid: 'user.udid' }, { username: 'user.name' }, { device: 'user.device_info.model' }, { zoneid: 'zone.id' }, { zonename: 'zone.name' }, { zonetags: 'zone.tags' }];| 
| filterOperators|operator of a filter|Array|[{ 'is greater than': 'gt' }, { 'is greater than or equal to': 'gte' }, { 'is less than': 'lt' }, { 'is less than or equal to': 'lte' }, { 'is euqal to': 'is' }, { contains: 'contains' }, { 'is not equal to': 'is not' }, { 'is one of': 'is one of' }, { 'is not one of': 'is not one of' }, { exists: 'exists' }, { 'does not exists': 'does not exists' }];|

> You can change filterOperators keys, but please don't change filterOperators values!

- Events

|name|description|arguments|
|:---|---|---|
|change|query has changed, perhaps caused by activeFilters, queryString, dateTimeStart, dateTimeEnd|new query|


## Example

![](./images/ElsQuery2.PNG)

Will generate query
```json
{"query":{"bool":{"must":[{"range":{"timestamp":{"gte":1522739455974,"lte":1522740355974,"format":"epoch_millis"}}},{"range":{"duration":{"gte":"asa"}}},{"bool":{"should":[{"match_phrase":{"zone.id":"sas"}}],"minimum_should_match":1}}],"must_not":[]}}}
```


## License
MIT

