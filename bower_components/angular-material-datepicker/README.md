# Angular Material Datepicker

Angular Material Datepicker is an AngularJS directive that generates a modal datepicker calendar just by clicking on the **event** icon.

> Available version for now is ***0.1.7***

![am-datepicker](http://s9.postimg.org/3lek5eqen/calendar.png)

## Requirements

- [AngularJS](https://angularjs.org)
- [Angular Material](https://material.angularjs.org/latest/)
- [MomentJS](http://momentjs.com)

## Example

[Live example](http://mrdannael.github.io/angular-material-datepicker/)

## Installation

### Bower

```
bower install angular-material-datepicker --save
```

### Browser

```html
<head>
[...]
<link rel="stylesheet" type="text/css" href="bower_components/angular-material-datepicker/dist/angular-material-datepicker.css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
[...]
</head>
<body>
[...]
<script src="bower_components/angular-material-datepicker/dist/angular-material-datepicker.js"></script>
</body>
```

### Dependency Injection

```javascript
angular.module('myApp', ['ngMaterial', 'amDate']);
```

## Usage

### Basic usage

```html
<am-datepicker ng-model="data"></am-datepicker>
```
> Datepicker requires *ng-model* attribute.

### Available attributes

Attribute | Type | Description
--- | --- | ---
**label** | *string* | Label for input field. If not set, dafault label is ***Date***.
**save** | *string* | Label for "*Save*" button. If not set, default label is ***Save***.
**cancel** | *string* | Label for "*Cancel*" button. If not set, default label is ***Cancel***.
**separator** | *string* | Separator for dates. If not set, default separator is ***-***.
**iclass** | *classname* | Class for md-icon.

### Locale

Locale of datepicker (except Save and Cancel buttons) depends on configuration of MomentJS locale. ([moment.locale()](http://momentjs.com/docs/#/i18n/getting-locale/)).


## License

The MIT License (MIT)

Copyright (c) 2015 Daniel Kaczmarek (mrdannael)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
