import { useEffect } from "react";
import { View } from "react-native";

function PublicRoute({ navigation, isLogin, children }) {

    useEffect(() => {
        isLogin && navigation.navigate('Home')
    }, [isLogin])

    if (!isLogin) {
        return children
    } else {
        return <View></View>
    }
}
export default PublicRoute;