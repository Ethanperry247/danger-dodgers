import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const UtilityBar = ({ navigation }) => (
 <Appbar style={styles.top}>
  <Appbar.Action
    icon="cog-outline"
    onPress={() => navigation.navigate('Settings')}
    />
   <Appbar.Action
     icon="information-outline"
     onPress={() => navigation.navigate('About')}
    />
  </Appbar>
 );

export default UtilityBar;

const styles = StyleSheet.create({
  top: {
    width: '100%'
  },
});