
import { useEffect } from 'react';
import { View } from 'react-native';
import { AppUntil } from '../AppUntil';

function AuthenLogin({ navigation, isLogin, children }) {

    useEffect(() => {
        !isLogin && navigation.navigate('Login')
    }, [isLogin])

    if (isLogin) {
        return children
    } else {
        return <View></View>
    }
}
export default AuthenLogin;