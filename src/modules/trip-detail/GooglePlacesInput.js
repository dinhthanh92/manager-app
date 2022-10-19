import React, { useEffect, useRef, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_PLACE_GOOGLE } from '../../../AppUntil';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image, Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const GooglePlacesInput = ({ opPressPlace, placeName }) => {
    const [newValue, setNewValue] = useState(placeName)

    useEffect(() => {
        setNewValue(placeName)
    }, [placeName])

    return (
        <>
            <GooglePlacesAutocomplete
                icon={(props) => <Icon {...props} name="dollar" />}
                textInputProps={{
                    value: newValue,
                    onChangeText: (value) => setNewValue(value)
                }}

                placeholder="Enter place"
                onPress={(data, details = null) => {
                    const location = details?.geometry.location
                    setNewValue(details.formatted_address)
                    opPressPlace(location.lat, location.lng, details.formatted_address)
                }}
                query={{ key: API_PLACE_GOOGLE, language: "vi", components: 'country:vn' }}
                fetchDetails={true}
                renderRow={results => {
                    if (results.isPredefinedPlace) {
                        return (
                            <>
                                <Image source="https://i.ya-webdesign.com/images/transparent-pin-google-2.png" style={{ width: 15, height: 25 }} />
                                <Text>{results.description}</Text>
                            </>
                        );
                    } else {
                        return <Text>{results.description}</Text>
                    }
                }}
                renderLeftButton={(props) => (
                    <View style={{ marginRight: 10, marginTop: 10 }}>
                        <Icon size={22} name="search-location" />
                    </View>
                )}
                onFail={error => console.log(error)}
                onNotFound={() => console.log('no results')}
                styles={{
                    container: {
                        flex: 0,
                        position: "relative"
                    },
                    textInputContainer: {
                        flexDirection: 'row',
                    },
                    textInput: {
                        backgroundColor: "#eeeeee",
                        border: 1,
                        borderColor: "#616161",
                        borderWidth: 1,
                    },
                    poweredContainer: {
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        borderBottomRightRadius: 5,
                        borderBottomLeftRadius: 5,
                        borderColor: '#c8c7cc',
                        borderTopWidth: 0.5,
                    },
                    powered: {},
                    listView: {
                        flex: 1,
                        position: "absolute",
                        marginTop: 50,
                        zIndex: 2,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 3,
                    },
                    row: {
                        backgroundColor: '#FFFFFF',
                        padding: 13,
                        height: 44,
                        flexDirection: 'row',

                    },
                    separator: {
                        height: 0.5,
                        backgroundColor: '#c8c7cc',
                    },
                    description: {},
                    loader: {

                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        height: 20,
                    },
                }}
            />

        </>

    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, //the container will fill the whole screen.
        height: 250,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
export default GooglePlacesInput;