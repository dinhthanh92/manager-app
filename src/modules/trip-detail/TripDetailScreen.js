import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Portal, Modal, Provider, TextInput, Button, Divider, IconButton } from "react-native-paper"
import { Card } from 'react-native-shadow-cards';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppUntil, API_PLACE_GOOGLE } from "../../../AppUntil";
import moment from 'moment'
import _ from 'lodash'
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import TripDetailCreateForm from "./Tripdetail.CreateForm";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TripDetailUpdateForm from "./Tripdetail.UpdateForm";
import TripDetailChart from "./TripDetail.Chart";
import TripDetailGoogleMap from "./TripDetail.GoogleMap";


function TripDetailScreen({ tripId }) {
    const [visibleModal, setVisibleModal] = useState(false)
    const myLocalFlashMessage = useRef(null)
    const [componentModal, setComponentModal] = useState(<View></View>)
    const [dataDestination, setDataDestination] = useState([]);
    const [dataTrip, setDataTrip] = useState({});
    const [searchText, setSearchText] = useState({});

    const [objAlert, setObjAlert] = useState({
        status: false,
        title: null,
        message: null,
        userId: null
    })

    const closeAlert = () => {
        setObjAlert(AppUntil.objectDefaultAlert())
    }

    useEffect(() => {
        if (tripId) {
            loadData()
        }
    }, [tripId])

    const loadData = async () => {
        const tripApi = axios.get(AppUntil.RequestApi("/trip/show/" + tripId), await AppUntil.RequsetHeader());
        const destinationApi = axios.get(AppUntil.RequestApi("/destination/index"), {
            ...await AppUntil.RequsetHeader(),
            params: { tripId }
        });
        axios.all([tripApi, destinationApi]).then(
            ([resTrip, resDestination]) => {
                if (resTrip?.data?.isSuccess && resDestination?.data?.isSuccess) {
                    setDataDestination(resDestination?.data?.results)
                    const totalPrice = _.sumBy(resDestination?.data?.results, x => x.price)
                    setDataTrip({
                        ...resTrip?.data?.results,
                        totalPrice
                    })
                }
            }
        )
    }

    const onLoadData = async () => {
        axios.get(AppUntil.RequestApi("/destination/index"), {
            ...await AppUntil.RequsetHeader(),
            params: { tripId, searchText }
        }).then(
            (res) => {
                setDataDestination(res?.data?.results)
            }
        )
    }

    const onDelete = async (id) => {
        axios.delete(AppUntil.RequestApi("/destination/delete/" + id), await AppUntil.RequsetHeader()).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    closeAlert()
                    myLocalFlashMessage.current.showMessage({
                        position: "top",
                        message: res?.data?.message,
                        type: "success",
                        autoHide: true,
                        showMessage: true
                    });
                    onLoadData()
                }
            }
        )
    }



    return (
        <View style={{ padding: 10 }}>
            <View>
                <View style={{ flexDirection: "row" }}>

                    <Text style={{ width: 100, fontSize: 18, fontWeight: "400" }}>
                        {dataTrip?.name}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Text style={{ flex: 0, marginRight: 10 }}>
                        <Icon name="clock-o" size={22} />
                    </Text>
                    <Text style={{ flex: 0.2 }}>
                        {moment(dataTrip.startTime).format("DD-MM-YYYY")}
                    </Text>
                    <Text style={{ flex: 0.1 }}>
                        <Icon name="arrow-right" size={16} />
                    </Text>
                    <Text style={{ flex: 0.2 }}>
                        {moment(dataTrip.endTime).format("DD-MM-YYYY")}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Text style={{ width: 100, fontSize: 18, fontWeight: "400" }}>
                        total price:
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                        {dataTrip?.totalPrice} $
                    </Text>
                </View>
            </View>

            <Divider style={{ marginBottom: 10, marginTop: 10 }} />



            <View style={{ fontSize: 24, margin: 5, flexDirection: "row", marginBottom: 5 }}>
                <View style={{ flex: 0.5 }}>
                    <Text style={{ fontSize: 24 }}>
                        List Destination
                    </Text>
                </View>
                <View style={{ flex: 0.5 }}>
                    <Button
                        icon={(props) => <Icon {...props} name="plus" />}
                        mode="contained"
                        onPress={() => {
                            setVisibleModal(true)
                            setComponentModal(
                                <TripDetailCreateForm
                                    headerTitle="Create destination"
                                    tripId={tripId}
                                    startTime={new Date(dataTrip.startTime)}
                                    endTime={new Date(dataTrip.endTime)}
                                    onCloseSubmit={(message) => {
                                        setVisibleModal(false);
                                        myLocalFlashMessage.current.showMessage({
                                            position: "top",
                                            message: message,
                                            type: "success",
                                            autoHide: true,
                                            showMessage: true,

                                        });
                                        onLoadData();
                                    }}
                                />
                            )
                        }}
                    >
                        Create Destination
                    </Button>
                </View>

            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 }}>
                <View style={{ marginLeft: 8 }}>
                    <Button
                        icon={(props) => <Icon {...props} name="pie-chart" color={"#841584"} />}
                        // mode="contained"
                        onPress={() => {
                            setVisibleModal(true)
                            setComponentModal(
                                <TripDetailChart
                                    headerTitle="Dashboard"
                                    tripId={tripId}
                                    onClose={() => {
                                        setVisibleModal(false);
                                    }}
                                />
                            )
                        }}
                    // buttonColor={"#841584"}

                    >
                        Dashboard
                    </Button>
                </View>
                <View style={{ marginLeft: 8 }}>
                    <Button
                        icon={(props) => <Icon {...props} name="map-marker" color={"#841584"} />}
                        onPress={() => {
                            setVisibleModal(true)
                            setComponentModal(
                                <TripDetailGoogleMap
                                    headerTitle="Google map"
                                    tripId={tripId}
                                    onClose={() => {
                                        setVisibleModal(false);
                                    }}
                                />
                            )
                        }}
                    // buttonColor={"#841584"}

                    >
                        Google map
                    </Button>
                </View>
            </View>

            <View style={{ marginBottom: 20, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        label='Search place / name'
                        value={searchText}
                        mode='flat'
                        onChangeText={(value) => {
                            setSearchText(value)
                        }}
                        right={
                            <TextInput.Icon
                                onPress={() => {
                                    onLoadData()
                                }}
                                icon={(props) => <Icon {...props} name="search" />}
                            />
                        }
                    />
                </View>
            </View>

            <FlatList
                data={dataDestination}
                renderItem={({ item }) => {
                    return <Card style={{ padding: 10, marginBottom: 10, marginRight: 0 }}>

                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>
                            {item.type} - {item.name}
                        </Text>

                        <View style={{ flexDirection: "row" }} >
                            <Text style={{ flex: 0, width: 30 }}>
                                <Icon name="clock-o" size={22} />
                            </Text>
                            <Text style={{ flex: 0.2 }}>
                                {moment(item.time).format("DD-MM-YYYY")}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 5 }} >
                            <Text style={{ flex: 0, width: 30 }}>
                                <Icon name="dollar" size={22} />
                            </Text>
                            <Text style={{ flex: 0.2 }}>
                                {item.price}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 5 }} >
                            <Text style={{ flex: 0, width: 30 }}>
                                <Icon name="location-arrow" size={22} />
                            </Text>
                            <Text style={{ flex: 1 }}>
                                {item.place}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 5 }} >
                            <Text style={{ flex: 0, width: 30 }}>
                                <Icon name="credit-card" size={22} />
                            </Text>
                            <Text style={{ flex: 1 }}>
                                {item.description}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 15, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <Text style={{ marginRight: 10, marginLeft: 10 }}>
                                <Button
                                    icon={(props) => <Icon name="edit" {...props} color="white" />}
                                    mode="contained"
                                    onPress={() => {
                                        setVisibleModal(true)
                                        setComponentModal(
                                            <TripDetailUpdateForm
                                                headerTitle="Update destination"
                                                destinationId={item._id}
                                                startTime={new Date(dataTrip.startTime)}
                                                endTime={new Date(dataTrip.endTime)}
                                                onCloseSubmit={(message) => {
                                                    setVisibleModal(false);
                                                    myLocalFlashMessage.current.showMessage({
                                                        position: "top",
                                                        message: message,
                                                        type: "success",
                                                        autoHide: true,
                                                        showMessage: true
                                                    });
                                                    onLoadData();
                                                }}
                                            />
                                        )
                                    }}
                                    color="#841584"
                                >Edit</Button>
                            </Text>

                            <Text >
                                <Button
                                    icon={(props) => <Icon name="trash" {...props} color="white" />}
                                    mode="contained"
                                    onPress={() => {
                                        setObjAlert({
                                            ...objAlert,
                                            title: "Confirm delete destination!",
                                            message: "Do you want to delete destination?",
                                            status: true,
                                            userId: item._id,
                                            onConfirmPressed: onDelete
                                        })
                                    }}
                                    color="#841584"
                                >Delete</Button>
                            </Text>
                        </View>

                    </Card>
                }}
            />
            {objAlert.status && AppUntil.RenderAlertConfirmCustom(objAlert, closeAlert)}
            < Portal >
                <Modal visible={visibleModal}
                    onDismiss={() => setVisibleModal(false)}
                    contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 30 }}>
                    {componentModal}
                </Modal>
            </Portal >
            <FlashMessage ref={myLocalFlashMessage} />
        </View >
    );
}
export default TripDetailScreen;