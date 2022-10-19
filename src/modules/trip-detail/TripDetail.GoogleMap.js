import axios from 'axios';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    Modal,
    Text,
    View, LogBox
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { AppUntil } from '../../../AppUntil';
import _ from "lodash"
import Icon from 'react-native-vector-icons/FontAwesome';
import MonthPicker from 'react-native-month';
import { Button } from 'react-native-paper';


function TripDetailGoogleMap({ headerTitle, tripId, onClose }) {

    const mapRef = useRef(null)

    const [dataOPtionPlace, setDataOPtionPlace] = useState([])

    const [currentLocation, setCurrentLocation] = useState({
        latitude: 20.9922672,
        longitude: 105.8171239,
        place: ""
    })

    const [dataMap, setDataMap] = useState([])


    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        axios.get(AppUntil.RequestApi("/destination/dashboard-map"), {
            ...await AppUntil.RequsetHeader(),
            params: {
                tripId
            }
        }).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    setDataOPtionPlace(getOption(res?.data?.results))
                    _.size(getOption(res?.data?.results)) > 0 && setCurrentLocation(getOption(res?.data?.results)[0])
                    setDataMap(res?.data?.results)
                }
            }
        )
    }

    const getOption = (propData) => {
        const data = [];
        _.map(propData, (item, index) => {
            data.push({
                value: item.latitude + "-" + item.longitude,
                label: item.des[0].place,
                longitude: item.longitude,
                latitude: item.latitude,
            })
        })
        return data;
    }

    return <View style={{ height: 650 }}>

        <Text style={{ textAlign: "center", fontSize: 24 }}>
            {headerTitle}
        </Text>
        <View>
            <View style={{ marginBottom: 10 }}>
                <Picker
                    key={1}
                    style={{
                        width: "100%",
                        backgroundColor: "#eeeeee",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                        const find = _.find(dataOPtionPlace, x => x.value === itemValue)
                        find && setCurrentLocation(find)
                    }}
                    selectedValue={currentLocation.value}
                >
                    {
                        _.map(dataOPtionPlace, (item, index) => {
                            return <Picker.Item label={item.label} value={item.value} key={index} />
                        })
                    }
                </Picker>
            </View>
            <View>
                <MapView
                    ref={mapRef}
                    style={{
                        position: "relative",
                        height: 500
                    }}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    showsUserLocation={true}
                    region={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onRegionChangeComplete={() =>
                        mapRef.current?.animateToRegion({
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            latitudeDelta: 1,
                            longitudeDelta: 1,
                        }, 300)
                    }
                >
                    {
                        _.size(dataMap) > 0 && _.map(dataMap, (item, index) => {
                            return < Marker
                                key={index}
                                description={"Total: " + _.sumBy(item.des, x => x.price) + "$"}
                                title={item.des[0].place}
                                coordinate={{
                                    latitude: item.latitude,
                                    longitude: item.longitude,
                                }} />
                        })
                    }
                </MapView>
            </View>
        </View>
        <View style={{ marginTop: 20 }}>
            <Button mode="contained" onPress={() => onClose()}>Close</Button>
        </View>
    </View >
}
export default TripDetailGoogleMap;