/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.tsx';
import {name as appName} from './app.json';

console.log('here is something')

AppRegistry.registerComponent(appName, () => App, { fabric: false });
