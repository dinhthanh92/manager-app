import { useRef, useState } from "react";
import { API_PLACE_GOOGLE, AppUntil } from "../../../AppUntil";
import { showMessage, hideMessage } from "react-native-flash-message";
import { TextInput, Button, Text, Provider } from 'react-native-paper';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import _ from "lodash";
import GooglePlacesInput from "./GooglePlacesInput";
import MapView, { Marker } from 'react-native-maps';

const errorFormDefault = AppUntil.ErrorDefautForm(["name", "price", "time", "place", "description", "type"])

function TripDetailCreateForm({ headerTitle, tripId, onCloseSubmit, onClose, startTime, endTime }) {

    const [errorForm, setErrorForm] = useState(errorFormDefault)

    const mapRef = useRef(null);

    const [initialvalues, setInitialvalues] = useState({
        name: null,
        price: null,
        place: null,
        latitude: null,
        longitude: null,
        description: null,
        time: null,
        type: AppUntil.typeDestination(2)
    })


    const setInit = (key, value) => {
        setInitialvalues({
            ...initialvalues,
            [key]: value
        })
    }



    const showDatePicker = (currentDate, key, minimumDate, maximumDate) => {
        DateTimePickerAndroid.open({
            value: currentDate,
            maximumDate: endTime,
            minimumDate: minimumDate || startTime,
            mode: 'date',
            onChange: (value, date) => {
                setInitialvalues({
                    ...initialvalues,
                    [key]: moment(date).format("DD-MM-YYYY")
                })
            }
        })
    };

    const onPressPlace = (lat, lng, placeName) => {
        const tokyoRegion = {
            latitude: 20.9922672,
            longitude: 105.8171239,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };


        setInitialvalues({
            ...initialvalues,
            latitude: lat,
            longitude: lng,
            place: placeName
        })

    }

    const onCreateDes = async () => {
        if (checkValid(initialvalues)) {
            const values = {
                ...initialvalues,
                tripId: tripId,
                time: moment(initialvalues.time, "DD-MM-YYYY")
            }
            axios.post(AppUntil.RequestApi("/destination/create"), values, await AppUntil.RequsetHeader()).then(
                (res) => {
                    if (res.data?.isSuccess) {

                        onCloseSubmit(res?.data?.message)
                    }
                }
            ).catch(
                (e) => {
                    console.log(123)
                }
            )
        }
    }


    const checkValid = (value) => {
        let isValid = true;
        let newErrorForm = { ...errorForm }
        if (!value.name) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "name")
            isValid = false
        }
        if (!value.price) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "price")
            isValid = false
        }
        if (!value.time) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "time")
            isValid = false
        }
        if (!value.place) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "place")
            isValid = false
        }
        !isValid && setErrorForm(newErrorForm)
        return isValid;
    }

    return (
        <View>
            <Text style={{ textAlign: "center", fontSize: 24 }}>
                {headerTitle}
            </Text>

            <View style={{ marginBottom: 10 }}>
                <TextInput
                    error={errorForm.name.status}
                    label='Enter name (*)'
                    value={initialvalues.name}
                    mode='outlined'
                    onChangeText={(value) => setInit("name", value)}
                    onChange={() => {
                        errorForm.name.status && setErrorForm({
                            ...errorForm,
                            name: errorFormDefault.name
                        })
                    }}
                    left={<TextInput.Icon icon="pencil" />}
                />
                {AppUntil.RenderMessageErrorForm(errorForm, "name")}
            </View>

            <View style={{ marginBottom: 10 }}>
                <Picker
                    selectedValue={initialvalues.type}
                    key={1}
                    style={{
                        width: "100%",
                        backgroundColor: "#eeeeee",
                    }}

                    onValueChange={(itemValue, itemIndex) => setInit("type", itemValue)}
                >
                    {
                        _.map(AppUntil.typeDestination(), (item, index) => {
                            return <Picker.Item label={item.label} value={item.value} key={index} />
                        })
                    }
                </Picker>
                {AppUntil.RenderMessageErrorForm(errorForm, "type")}
            </View>


            <View style={{ marginBottom: 10 }}>

                <TextInput
                    error={errorForm.price.status}
                    label='Enter price (*)'
                    keyboardType='numeric'
                    value={initialvalues.price}
                    mode='outlined'
                    onChangeText={(value) => {
                        const newValue = AppUntil.onChangeTextNumber(_.toString(value))
                        setInit("price", newValue)
                    }}
                    onChange={() => {
                        errorForm.name.status && setErrorForm({
                            ...errorForm,
                            price: errorFormDefault.price
                        })
                    }}
                    left={<TextInput.Icon icon={(props) => <Icon {...props} name="dollar" />} />}
                />
                {AppUntil.RenderMessageErrorForm(errorForm, "price")}
            </View>

            <View style={{ marginBottom: 10 }}>
                <TextInput
                    error={errorForm.time.status}
                    label='Enter time (*)'
                    value={initialvalues.time}
                    mode='outlined'
                    onPressIn={() => {
                        const newValue = initialvalues.time ? moment(initialvalues.time, "DD-MM-YYYY") : new Date()
                        showDatePicker(new Date(newValue), "time")
                    }}
                    left={<TextInput.Icon icon="calendar" />}
                />
                {AppUntil.RenderMessageErrorForm(errorForm, "time")}
            </View>

            <View style={{ marginBottom: 10, position: "relative" }}>
                <TextInput
                    error={errorForm.description.status}
                    label='Enter description'
                    value={initialvalues.description}
                    onChangeText={(value) => setInit("description", value)}
                    multiline={true}
                    numberOfLines={4}
                    mode='outlined' />
                {AppUntil.RenderMessageErrorForm(errorForm, "description")}
            </View>


            <View style={{ padding: 0, marginTop: 8 }}>
                <View style={{ marginBottom: 10 }}>
                    <SafeAreaView >
                        <GooglePlacesInput opPressPlace={onPressPlace} />
                    </SafeAreaView>
                    {AppUntil.RenderMessageErrorForm(errorForm, "place")}
                </View>
            </View>

            <View style={{ padding: 0, marginTop: 8 }}>
                {/*Render our MapView*/}
                <MapView
                    ref={mapRef}
                    style={{
                        position: "relative",
                        height: 200
                    }}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    showsUserLocation={true}
                    region={{
                        latitude: initialvalues.latitude || 20.9922672,
                        longitude: initialvalues.longitude || 105.8171239,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onRegionChangeComplete={() =>
                        mapRef.current?.animateToRegion({
                            latitude: initialvalues.latitude,
                            longitude: initialvalues.longitude,
                            latitudeDelta: 1,
                            longitudeDelta: 1,
                        }, 300)
                    }
                >
                    {
                        initialvalues.place && < Marker coordinate={{
                            latitude: initialvalues.latitude,
                            longitude: initialvalues.longitude,
                        }} />
                    }
                </MapView>

            </View>

            <Button
                onPress={() => {
                    onCreateDes()
                }}
                style={{ marginTop: 10 }}
                mode="contained"
                color="#841584"
            >
                Create
            </Button>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
export default TripDetailCreateForm;