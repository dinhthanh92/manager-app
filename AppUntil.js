import * as SecureStore from 'expo-secure-store';
import { Text } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
// import DatePicker from 'react-native-date-picker'
import { View } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

const URL_HOST = "http://192.168.1.17:8080/api"

// const URL_HOST = "http://172.16.2.22:8080/api"

export const API_PLACE_GOOGLE = "AIzaSyAlEVCVx7A-j4finwCR_h2i4SjtIyruEug";

export const API_GOOGLE_PLACE = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${API_PLACE_GOOGLE}&query=`;

export class AppUntil {

    static RequestPlaceApi = (str) => {
        new URLSearchParams(str).toString()
        const api = API_GOOGLE_PLACE + new URLSearchParams(str).toString()
        return api
    }

    static RequestApi = (url) => {
        return `${URL_HOST}${url}`
    }
    static RequsetHeader = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        return {
            headers: {
                bearer: accessToken
            }
        }
    }

    static SetAccessToken = async (accessToken) => {
        await SecureStore.setItemAsync("accessToken", accessToken);
    }

    static DeleteAccessToken = async (key) => {
        await SecureStore.deleteItemAsync(key)
    }

    static ErrorDefautForm = (arrayKey) => {
        let newObject = {}
        arrayKey.map(item => {
            newObject = {
                ...newObject,
                [item]: {
                    status: false,
                    message: null
                }
            }
        })
        return newObject;
    }

    static SetErrorForm = (objectError, key, typeMessage = 1) => {
        let message = "This is field requid!"
        switch (typeMessage) {
            case 1:
                break;
            case 2:
                message = "example@example.com";
            case 3:
                message = "Confirm password not match!";
            default: break;
        }
        const newObject = {
            ...objectError,
            [key]: {
                status: true,
                message
            }
        }
        return newObject;
    }

    static RenderMessageErrorForm = (objectError, key) => {
        if (objectError[key].status) {
            return <Text style={{ marginTop: 5, color: "red" }}>{objectError[key].message}</Text>
        } else return null
    }

    static objectDefaultAlert = () => {
        return {
            status: false,
            title: null,
            message: null
        }
    }

    static RenderAlertCustom = (objectAlert, hideAlert) => {
        return <AwesomeAlert
            show={objectAlert.status}
            showProgress={!objectAlert.title ? true : false}
            title={objectAlert.title || "Loading ..."}
            message={objectAlert.message}
            closeOnTouchOutside={objectAlert.title ? true : false}
            closeOnHardwareBackPress={false}
            showCancelButton={objectAlert.title ? true : false}
            showConfirmButton={false}
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
                hideAlert()
            }}
        />
    }

    static RenderAlertConfirmCustom = (objectAlert, hideAlert) => {
        return <AwesomeAlert
            show={objectAlert.status || null}
            showProgress={objectAlert.status ? !objectAlert.title ? true : false : null}
            title={objectAlert.status ? objectAlert.title || "Loading ..." : null}
            message={objectAlert.message}
            onConfirmPressed={() => objectAlert.status && objectAlert.onConfirmPressed(objectAlert.userId)}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={true}
            showCancelButton={objectAlert.status && objectAlert.title ? true : false}
            showConfirmButton={objectAlert.status && objectAlert.title ? true : false}
            confirmText="Yes"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
                hideAlert()
            }}
        />
    }

    static RenderDateRangePicker = (component, onChange, displayedDate = moment()) => {
        // return <RNDa mode="date" />
    }

    static validateEmail = (email) => {
        return email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    static onChangeTextNumber = (text) => {
        let newText = '';
        let numbers = '0123456789.';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("please enter numbers only");
            }
        }
        return newText
    }

    static typeDestination = (index) => {
        const value = [
            { label: "Type eating", value: "EATING" },
            { label: "Type Accommodation", value: "ACCOMMODATION" },
            { label: "Type Other", value: "OTHER" },
        ]
        if (index) {
            return value[index].value
        }
        return value;
    }
}