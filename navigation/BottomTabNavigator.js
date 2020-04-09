import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import TutorialScreen from '../screens/TutorialScreen';
import SplitScreen from '../screens/SplitScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Tutorial';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        id="tab_tutorial"
        name="Tutorial"
        component={TutorialScreen}
        options={{
          title: 'Tutorial',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="help" />,
        }}
      />
      <BottomTab.Screen
        key="tab_split"
        name="Split"
        component={SplitScreen}
        options={{
          title: 'Split',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" set="Ionicons"/>,
        }}
      />
      
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Tutorial':
      return 'How it works~';
    case 'Links':
      return 'Links to learn more';
    case 'Split':
      return 'Split your bill!';

  }
}
