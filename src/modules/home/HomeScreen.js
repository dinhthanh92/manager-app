import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, } from "react-native";
import { Portal, Modal, Provider, TextInput, Button } from "react-native-paper"
import { Card } from 'react-native-shadow-cards';
import TripCreateForm from "./Trip.CreateForm";
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppUntil } from "../../../AppUntil";
import moment from 'moment'
import TripUpdateForm from "./Trip.UpdateForm";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

function HomeScreen({ setTripId, navigation }) {
    const [visibleModal, setVisibleModal] = useState(false)
    const myLocalFlashMessage = useRef(null)
    const [componentModal, setComponentModal] = useState(<View></View>)
    const [searchText, setSearchText] = useState({});
    const [objAlert, setObjAlert] = useState({
        status: false,
        title: null,
        message: null,
        userId: null
    })
    const [dataTrip, setDataTrip] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        axios.get(AppUntil.RequestApi("/trip/index"), {
            ...await AppUntil.RequsetHeader(),
            params: {
                name: searchText
            }
        }).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    setDataTrip(res?.data?.results)
                    setObjAlert(AppUntil.objectDefaultAlert())
                }
            }
        )
    }

    const deleteTrip = async (id) => {
        setObjAlert({
            ...objAlert,
            title: null
        })
        axios.delete(AppUntil.RequestApi("/trip/delete/" + id), await AppUntil.RequsetHeader()).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    showMessage({
                        position: "top",
                        message: "Delete trip successfully!",
                        type: "success",
                        autoHide: true,
                        showMessage: true
                    });
                    loadData()
                }
                setObjAlert(AppUntil.objectDefaultAlert())
            }
        ).catch(
            e => {
                showMessage({
                    position: "top",
                    message: "Delete trip fail!",
                    type: "danger",
                    autoHide: true,
                    showMessage: true
                });
                closeAlert()
            }
        )
    }
    const clearDataAsync = async () => {
        setObjAlert({
            ...objAlert,
            title: null
        })
        axios.delete(AppUntil.RequestApi("/trip/delete-async/"), await AppUntil.RequsetHeader()).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    showMessage({
                        position: "top",
                        message: "Clear data successfully!",
                        type: "success",
                        autoHide: true,
                        showMessage: true
                    });
                    loadData()
                }
                setObjAlert(AppUntil.objectDefaultAlert())
            }
        ).catch(
            e => {
                showMessage({
                    position: "top",
                    message: "Delete trip fail!",
                    type: "danger",
                    autoHide: true,
                    showMessage: true
                });
                closeAlert()
            }
        )
    }

    const closeAlert = () => {
        setObjAlert(AppUntil.objectDefaultAlert())
    }

    return (
        <View style={{ padding: 10 }}>
            <View style={{ fontSize: 24, margin: 5, flexDirection: "row", marginBottom: 20 }}>
                <View style={{ flex: 0.5 }}>
                    <Text style={{ fontSize: 24 }}>
                        List trip

                    </Text>
                </View>

                <View style={{ flex: 0.5, marginRight: 5 }}>
                    <Button
                        icon={(props) => <Icon {...props} name="trash" />}
                        mode="contained"
                        onPress={() => {
                            setObjAlert({
                                ...objAlert,
                                title: "Confirm clear data!",
                                message: "Do you want to clear data?",
                                status: true,
                                onConfirmPressed: clearDataAsync
                            })
                        }}
                        color="#841584"
                        style={{ backgroundColor: "#990000" }}
                    >
                        Clear all data
                    </Button>
                </View>

                <View style={{ flex: 0.5 }}>
                    <Button
                        icon={(props) => <Icon {...props} name="plus" />}
                        mode="contained"
                        onPress={() => {
                            setVisibleModal(true)
                            setComponentModal(
                                <TripCreateForm
                                    headerTitle="Create trip"
                                    onClose={() => {
                                        setVisibleModal(false);
                                        myLocalFlashMessage.current.showMessage({
                                            position: "top",
                                            message: "Create trip success",
                                            type: "success",
                                            autoHide: true,
                                            showMessage: true
                                        });
                                        loadData();
                                    }}
                                />
                            )
                        }}
                        color="#841584"
                    >
                        Create Trip
                    </Button>
                </View>

            </View>
            <View style={{ marginBottom: 20, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        label='Search name'
                        value={searchText}
                        mode='flat'
                        onChangeText={(value) => {
                            setSearchText(value)
                        }}
                        right={
                            <TextInput.Icon
                                onPress={() => {
                                    loadData()
                                }}
                                icon={(props) => <Icon {...props} name="search" />}
                            />
                        }
                    />
                </View>
            </View>
            <FlatList
                data={dataTrip}
                renderItem={({ item }) => {
                    return <Card style={{ padding: 10, marginBottom: 10, marginRight: 0 }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>
                            {item.name}
                        </Text>

                        <View style={{ flexDirection: "row" }} >
                            <Text style={{ flex: 0, marginRight: 10 }}>
                                <Icon name="clock-o" size={22} />
                            </Text>
                            <Text style={{ flex: 0.2 }}>
                                {moment(item.startTime).format("DD-MM-YYYY")}
                            </Text>
                            <Text style={{ flex: 0.1 }}>
                                <Icon name="arrow-right" size={16} />
                            </Text>
                            <Text style={{ flex: 0.2 }}>
                                {moment(item.endTime).format("DD-MM-YYYY")}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 15, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <Text>
                                <Button
                                    icon={(props) => <Icon name="eye" {...props} color="white" />}
                                    onPress={() => {
                                        setTripId(item._id)
                                        navigation.navigate('TripDetail')
                                    }}
                                    mode="contained"
                                    color="#841584"
                                >View</Button>
                            </Text>
                            <Text style={{ marginRight: 10, marginLeft: 10 }}>
                                <Button
                                    icon={(props) => <Icon name="edit" {...props} color="white" />}
                                    mode="contained"
                                    onPress={() => {
                                        setVisibleModal(true)
                                        setComponentModal(
                                            <TripUpdateForm
                                                headerTitle="Update trip"
                                                onClose={() => {
                                                    setVisibleModal(false);
                                                    myLocalFlashMessage.current.showMessage({
                                                        position: "top",
                                                        message: "Update trip success",
                                                        type: "success",
                                                        autoHide: true,
                                                        showMessage: true
                                                    });
                                                    loadData();
                                                }}
                                                tripId={item._id}
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
                                            title: "Confirm delete user!",
                                            message: "Do you want to delete user?",
                                            status: true,
                                            userId: item._id,
                                            onConfirmPressed: deleteTrip
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
export default HomeScreen;