# React-materialui-pigination

A simple react component with Material-UI for pagination

[![Build Status](https://travis-ci.org/PengWang0316/ReactMaterialUiPagination.svg?branch=master)](https://travis-ci.org/PengWang0316/ReactMaterialUiPagination)
[![Coverage Status](https://coveralls.io/repos/github/PengWang0316/ReactMaterialUiPagination/badge.svg?branch=master)](https://coveralls.io/github/PengWang0316/ReactMaterialUiPagination?branch=master)

![](http://res.cloudinary.com/orderstaker/image/upload/c_scale,q_auto:good,w_380/v1532933078/others/20180729_234108.gif)

# Installing

```
npm install --save @kevinwang0316/react-materialui-pagination
```

# Dependencies requirement

Due to this library is using React and Material-ui, some libraries are required.
Usually, the project needs this component has already installed these libraries. Please check your package.json file.

- @material-ui/core
- react
- prop-types

# Usage

```javascript
import Pagination from '@kevinwang0316/react-materialui-pagination';

// In your component
<Pagination
  offset={startOffsetNumber}
  limit={limitationForEachPage}
  total={totalNumber}
  onClick={onClickCallBackFunction}
/>
```

# A mini example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Pagination from '@kevinwang0316/react-materialui-pagination';
 
class PaginationExample extends React.Component {
  
  handleClick = offset => {
    // Do your data loading or whatever you want here with the offset.
  };
 
  render() {
    return (
      <MuiThemeProvider>
        <Pagination
          offset={0}
          limit={10}
          total={100}
          onClick={this.handleClick}
        />
      </MuiThemeProvider>
    );
  }
}
 
ReactDOM.render(
  <PaginationExample/>,
  document.getElementById('app')
);
```

# Props explaination

| Name        | Type           | Desription  |
| ------------- |-------------| -----|
| offset (required) | number | This tells the pagination how many rows will be skipped when initializes the component.  It should be equal or greater than 0. |
| limit (required) | number | The number of rows will be showed in one page.  It should be equal or greater than 1. |
| total (required) | number | The total number of rows.  It should be greater than 0. |
| onClick (required) | function | The callback function will be called when a user click a page number.  The function will be:  function(offset) => void  offset: A number of new offset |


# License

React-materialui-pagination is licensed under MIT License - see the [License file](https://github.com/PengWang0316/ReactMaterialUiPagination/blob/master/LICENSE).
