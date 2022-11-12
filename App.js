import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/modules/login/LoginScreen';
import HomeScreen from './src/modules/home/HomeScreen';
import axios from 'axios';
import { AppUntil } from './AppUntil';
import AuthenLogin from './src/AuthernLogin';
import PublicRoute from './src/PublicRoute';
import CustomNavigationBar from './src/CustomNavigationBar';
// import { Icon } from 'react-native-vector-icons/icon';
import { Provider } from 'react-native-paper';
import UserScreen from './src/user/UserScreen';
import TripDetailScreen from './src/modules/trip-detail/TripDetailScreen';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App({ }) {

  const [isLogin, setIsLogin] = useState(null);
  const [typeUser, setTypeUser] = useState("ADMIN")
  const [tripId, setTripId] = useState(null)

  useEffect(() => {
    checkLogin()
  }, []);
  useEffect(() => {
    setType()
  }, [isLogin]);

  const checkLogin = async () => {
    axios.get(AppUntil.RequestApi("/check-auth/check-login-native"),
      await AppUntil.RequsetHeader()).then(
        (res) => {
          setIsLogin(true)
        }
      ).catch(
        err => {
          setIsLogin(false)
        }
      )
  }
  const setType = async () => {
    axios.get(AppUntil.RequestApi("/check-auth/check-login-native"),
        await AppUntil.RequsetHeader()).then(
        (res) => {
          setTypeUser(res?.data?.results.type)
        }
    ).catch(
        err => {
        }
    )
  }

  const onSignOut = () => {
    AppUntil.DeleteAccessToken("accessToken")
    setIsLogin(false)
  }

  if (isLogin === null && isLogin !== false) {
    return <View></View>
  }
  return <NavigationContainer>
    {
      !isLogin ? <Provider>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
          >
            {(props) => <PublicRoute {...props} isLogin={isLogin}>
              <LoginScreen  {...props} setIsLogin={setIsLogin} />
            </PublicRoute>}
          </Stack.Screen>

        </Stack.Navigator>
      </Provider> : <Provider>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} onSignOut={onSignOut} typeUSer={typeUser} />,
          }}
        >
          <Stack.Screen
            name="Home"
            option={{ headerShown: true }}
          >
            {(props) => <AuthenLogin {...props} isLogin={isLogin}>
              <HomeScreen  {...props} setTripId={setTripId} />
            </AuthenLogin>}
          </Stack.Screen>
          <Stack.Screen
            name="User"
            option={{ headerShown: true }}
          >
            {(props) => <AuthenLogin {...props} isLogin={isLogin}>
              <UserScreen  {...props} />
            </AuthenLogin>}
          </Stack.Screen>
          <Stack.Screen
            name="TripDetail"
            option={{ headerShown: true }}
          >
            {(props) => <AuthenLogin {...props} isLogin={isLogin}>
              <TripDetailScreen  {...props} tripId={tripId} />
            </AuthenLogin>}
          </Stack.Screen>
        </Stack.Navigator>
      </Provider>
    }

  </NavigationContainer >
}


export default App;
