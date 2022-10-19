import { Alert, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import { TextInput, Button, Text, Portal, Modal, } from 'react-native-paper';
import { useRef, useState } from 'react';
import { AppUntil } from '../../../AppUntil';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChangePassword from './ChangePassword';

const errorFormDefault = AppUntil.ErrorDefautForm(["username", "password"])

function LoginScreen({ navigation, setIsLogin }) {

    const [visibleModal, setVisibleModal] = useState(false)
    const [componentModal, setComponentModal] = useState(<View></View>)

    const emailRef = useRef(null)
    const [errorForm, setErrorForm] = useState(errorFormDefault)
    const [objAlert, setObjAlert] = useState({
        status: false,
        title: null,
        message: null,
    })

    const onLogin = (value) => {
        if (isVailDate(value)) {
            setObjAlert({
                ...objAlert,
                status: true,
                title: null
            })
            axios.post(AppUntil.RequestApi("/auth/login"), value).then(
                (res) => {
                    console.log(res.data)
                    if (res?.data?.isSuccess) {
                        if (!res?.data?.results.user?.isFirst) {
                            AppUntil.SetAccessToken(res?.data?.results?.token)
                            setTimeout(() => {
                                closeAlert()
                            }, 500)
                            setIsLogin(true);
                        } else {
                            closeAlert()
                            setVisibleModal(true)
                            setComponentModal(
                                <ChangePassword
                                    headerTitle="Change password"
                                    token={res?.data?.results?.token}
                                    onCloseSubmit={() => {
                                        setVisibleModal(false);
                                        AppUntil.SetAccessToken(res?.data?.results?.token)
                                        setIsLogin(true);
                                    }}
                                />
                            )
                        }
                    } else {
                        const errors = res?.data?.message
                        if (errors) {
                            setTimeout(() => {
                                setObjAlert({
                                    ...objAlert,
                                    title: "!!!",
                                    message: errors,
                                    status: true
                                })
                            }, 500)
                        } else {
                            setTimeout(() => {
                                closeAlert()
                            }, 500)
                        }
                    }
                }
            ).catch(
                (err) => {

                }
            )

        }
    }

    const isVailDate = (value) => {
        let isValid = true;
        let newErrorForm = { ...errorForm }
        if (!value.username) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "username")
            isValid = false
        }
        if (!value.password) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "password")
            isValid = false
        }
        !isValid && setErrorForm(newErrorForm)
        return isValid;
    }

    const closeAlert = () => {
        setObjAlert(AppUntil.objectDefaultAlert())
    }

    return <>
        <Formik
            initialValues={{}}
            onSubmit={(values) => onLogin(values)}
        >
            {
                ({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={{ padding: 20 }}>
                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                error={errorForm.username.status}
                                label='Enter name'
                                mode='outlined'
                                onChangeText={handleChange("username")}
                                onChange={() => {
                                    errorForm.username.status && setErrorForm({
                                        ...errorForm,
                                        username: errorFormDefault.username
                                    })
                                }}
                                onBlur={handleBlur('username')}
                                left={<TextInput.Icon icon="account" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "username")}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <TextInput
                                error={errorForm.password.status}
                                label='Enter password'
                                mode='outlined'
                                secureTextEntry
                                onChangeText={handleChange('password')}
                                onChange={() => {
                                    errorForm.password.status && setErrorForm({
                                        ...errorForm,
                                        password: errorFormDefault.password
                                    })
                                }}
                                onBlur={handleBlur('password')}
                                left={<TextInput.Icon icon="key" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "password")}
                        </View>
                        <Button
                            onPress={handleSubmit}
                            mode="contained"
                            color="#841584"
                        >
                            Login
                        </Button>
                        {AppUntil.RenderAlertCustom(objAlert, closeAlert)}
                    </View>
                )
            }
        </Formik >
        < Portal >
            <Modal visible={visibleModal}
                onDismiss={() => setVisibleModal(false)}
                contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 30 }}>
                {componentModal}
            </Modal>
        </Portal >
    </>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default LoginScreen;