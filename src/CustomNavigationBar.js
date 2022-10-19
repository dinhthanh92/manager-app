import { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppUntil } from '../AppUntil';

function CustomNavigationBar({ navigation, back, onSignOut, typeUSer }) {
    const [visibles, setVisible] = useState(false);


    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} mode='contained' /> : null}
            <Appbar.Content title="M-Expense" />
            <Menu
                visible={visibles}
                onDismiss={() => setVisible(false)}
                anchor={
                    <Appbar.Action
                        icon="menu" color="white"
                        mode='contained'
                        onPress={() => setVisible(true)} />
                }>
                <Menu.Item onPress={() => { navigation.navigate('Home') }}
                    title="Home" icon={"home"} />

                {
                    typeUSer === "ADMIN" && <Menu.Item onPress={() => { navigation.navigate('User') }}
                        title="Manager user" icon={"account"} />
                }

                <Menu.Item
                    onPress={() => { onSignOut() }}
                    title="Sign out" icon={(props) => <Icon name="sign-out" {...props} />}
                />
            </Menu>
        </Appbar.Header >
    );
}
export default CustomNavigationBar;