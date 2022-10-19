import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, } from "react-native";
import { Portal, Modal, Provider, TextInput, Button } from "react-native-paper"
import { Card } from 'react-native-shadow-cards';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
import { AppUntil } from "../../AppUntil";
import UserCreateForm from "./User.CreateForm";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";



function UserScreen() {
    const [visibleModal, setVisibleModal] = useState(false)
    const myLocalFlashMessage = useRef(null)
    const [componentModal, setComponentModal] = useState(<View></View>)
    const [dataUser, setDataUser] = useState([])
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
        loadData()
    }, [])

    const loadData = async () => {
        axios.get(AppUntil.RequestApi("/user/index"), {
            ...await AppUntil.RequsetHeader(),
            params: {
                username: null
            }
        }).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    setDataUser(res?.data?.results)
                }
            }
        )
    }

    const resetPassword = async (userId) => {
        setObjAlert({
            ...objAlert,
            status: true,
            title: null
        })
        axios.post(AppUntil.RequestApi("/user/reset-password/" + userId), {}, await AppUntil.RequsetHeader()).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    myLocalFlashMessage.current.showMessage({
                        position: "top",
                        message: "Change password successfully!",
                        type: "success",
                        autoHide: true,
                        showMessage: true
                    });
                    closeAlert()
                }
            }
        ).catch(
            e => {
                myLocalFlashMessage.current.showMessage({
                    position: "top",
                    message: "Change password fail!",
                    type: "danger",
                    autoHide: true,
                    showMessage: true
                });
                closeAlert()
            }
        )
    }

    const deleteUser = async (userId) => {
        setObjAlert({
            ...objAlert,
            title: null
        })
        axios.delete(AppUntil.RequestApi("/user/delete/" + userId), await AppUntil.RequsetHeader()).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    closeAlert()
                    myLocalFlashMessage.current.showMessage({
                        position: "top",
                        message: "Delete user successfully!",
                        type: "success",
                        autoHide: true,
                        showMessage: true
                    });
                    loadData()
                }
            }
        ).catch(
            e => {
                myLocalFlashMessage.current.showMessage({
                    position: "top",
                    message: "Delete user fail!",
                    type: "danger",
                    autoHide: true,
                    showMessage: true
                });
                closeAlert()
            }
        )
    }


    return (

        <View style={{ padding: 10 }}>
            <View style={{ fontSize: 24, margin: 5, flexDirection: "row", marginBottom: 20 }}>
                <View style={{ flex: 0.5 }}>
                    <Text style={{ fontSize: 24 }}>
                        List user
                    </Text>
                </View>
                <View style={{ flex: 0.5 }}>
                    <Button
                        icon={(props) => <Icon {...props} name="plus" />}
                        mode="contained"
                        onPress={() => {
                            setVisibleModal(true);
                            setComponentModal(
                                <UserCreateForm
                                    headerTitle="Create user"
                                    onCloseCancel={
                                        () => {
                                            setVisibleModal(false)
                                        }
                                    }
                                    onClose={
                                        () => {
                                            myLocalFlashMessage.current.showMessage({
                                                position: "top",
                                                message: "Create user successfully!",
                                                type: "success",
                                                autoHide: true,
                                                showMessage: true
                                            });
                                            loadData();
                                            setVisibleModal(false)
                                        }
                                    }
                                />
                            )
                        }}
                        color="#841584"
                    >
                        Create user
                    </Button>
                </View>
            </View>
            <FlatList
                data={dataUser}
                renderItem={({ item }) => {

                    return <Card style={{ padding: 10, marginBottom: 10, marginRight: 0 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10, marginRight: 50 }}>
                                Email:
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 10 }}>
                                {item.email}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10, marginRight: 15 }}>
                                Username:
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 10 }}>
                                {item.username}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 15, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <Text style={{ marginRight: 10, marginLeft: 10 }}>
                                <Button
                                    icon={(props) => <Icon name="edit" {...props} color="white" />}
                                    mode="contained"
                                    onPress={() => {
                                        setObjAlert({
                                            ...objAlert,
                                            title: "Confirm reset password!",
                                            message: "Do you want to reset password this user?",
                                            status: true,
                                            userId: item._id,
                                            onConfirmPressed: resetPassword
                                        })
                                    }}
                                    color="#841584"
                                >Reset password</Button>
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
                                            onConfirmPressed: deleteUser
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
    )
}
export default UserScreen;