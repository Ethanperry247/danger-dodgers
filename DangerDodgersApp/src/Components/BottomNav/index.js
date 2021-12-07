// import React from 'react';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { useTheme, Portal, FAB } from 'react-native-paper';
// import About from '../../Screens/About';
// import Alerts from '../../Screens/Alerts';
// import MainMap from '../../Screens/MainMap';
// import Reports from '../../Screens/Reports';

// // const Tab = createMaterialBottomTabNavigator();

// const BottomNav = () => {
//     return (
//         <React.Fragment>
//             <Tab.Navigator
//                 initialRouteName="Feed"
//                 backBehavior="initialRoute"
//                 shifting={true}
//                 sceneAnimationEnabled={false}
//             >
//                 <Tab.Screen
//                     name="About"
//                     component={About}
//                     options={{
//                         tabBarIcon: 'about',
//                     }}
//                 />
//                 <Tab.Screen
//                     name="Alerts"
//                     component={Alerts}
//                     options={{
//                         tabBarIcon: 'alerts',
//                     }}
//                 />
//                 <Tab.Screen
//                     name="MainMap"
//                     component={MainMap}
//                     options={{
//                         tabBarIcon: 'main-map',
//                     }}
//                 />
//                 <Tab.Screen
//                     name="Reports"
//                     component={Reports}
//                     options={{
//                         tabBarIcon: 'reports',
//                     }}
//                 />
//             </Tab.Navigator>
//             <Portal>
//                 <FAB
//                     icon="feather"
//                     style={{
//                         position: 'absolute',
//                         bottom: 100,
//                         right: 16,
//                     }}
//                 />
//             </Portal>
//         </React.Fragment>
//     );
// }

// export default BottomNav;