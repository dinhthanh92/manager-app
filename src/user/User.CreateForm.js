import { Alert, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRef, useState } from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppUntil } from '../../AppUntil';

const errorFormDefault = AppUntil.ErrorDefautForm(["email", "username"])

function UserCreateForm({ onClose, headerTitle }) {

    const [errorForm, setErrorForm] = useState(errorFormDefault)

    const [objAlert, setObjAlert] = useState({
        status: false,
        title: null,
        message: null,
    })

    const onCreateUser = async (values) => {
        if (checkValid(values)) {
            setObjAlert({
                ...objAlert,
                status: true,
                title: null
            })
            axios.post(AppUntil.RequestApi("/user/create"), values, await AppUntil.RequsetHeader()).then(
                (res) => {
                    if (res?.data?.isSuccess) {
                        onClose()
                        setTimeout(() => {
                            closeAlert()
                        }, 500)
                    } else {
                        const errors = res?.data?.message
                        setTimeout(() => {
                            setObjAlert({
                                ...objAlert,
                                title: <View><Icon name="info-circle" size={65} color="#900" /></View>,
                                message: errors,
                                status: true
                            })
                        }, 500)
                    }
                }
            )
        }
    }

    const closeAlert = () => {
        setObjAlert(AppUntil.objectDefaultAlert())
    }

    const checkValid = (value) => {
        let isValid = true;
        let newErrorForm = { ...errorForm }
        if (!value.username) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "username")
            isValid = false
        }
        if (!value.email) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "email")
            isValid = false
        } else if (!AppUntil.validateEmail(value.email)) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "email", 2)
            isValid = false
        }
        !isValid && setErrorForm(newErrorForm)
        return isValid;
    }

    return <View>
        <Text style={{ textAlign: "center", fontSize: 24 }}>
            {headerTitle}
        </Text>
        <Formik
            initialValues={{}}
            onSubmit={(values) => onCreateUser(values)}
        >
            {
                ({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={{ padding: 20 }}>
                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                error={errorForm.email.status}
                                label='Enter email'
                                mode='outlined'
                                onChangeText={handleChange("email")}
                                onChange={() => {
                                    errorForm.email.status && setErrorForm({
                                        ...errorForm,
                                        email: errorFormDefault.email
                                    })
                                }}
                                onBlur={handleBlur('email')}
                                left={<TextInput.Icon icon="account" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "email")}
                        </View>

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

                        <Button
                            onPress={handleSubmit}
                            mode="contained"
                            color="#841584"
                        >
                            Create
                        </Button>
                        {AppUntil.RenderAlertCustom(objAlert, closeAlert)}
                    </View>
                )
            }
        </Formik >
    </View>
}
export default UserCreateForm;