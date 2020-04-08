import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Icon} from 'react-native-elements'

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  if (props.set==="Ionicons") {
    return (
      <Ionicons
        name={props.name}
        size={30}
        style={{ marginBottom: -3 }}
        color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    )
  } 
  else return (
      <Icon
        name={props.name}
        size={30}
        style={{ marginBottom: -3 }}
        color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
  )
}
