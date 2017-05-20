import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'

/*
https://api.whentomanage.com/v1/accounts/2985/menu_items?accesstoken=<accesstoken>
*/
const accessToken = process.env.PEACHWORKS_ACCESS_TOKEN;

render(
  <h1>{ accessToken }</h1>,
  document.getElementById('root')
);

