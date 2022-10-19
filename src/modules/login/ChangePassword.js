import { useState } from "react";
import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { AppUntil } from "../../../AppUntil";
import { Formik } from 'formik';
import axios from "axios";

const errorFormDefault = AppUntil.ErrorDefautForm(["confirmPassword", "password"])

function ChangePassword({ headerTitle, token, onCloseSubmit }) {
    const [errorForm, setErrorForm] = useState(errorFormDefault)

    const onChangePassword = (values) => {
        if (isVailDate(values)) {
            axios.post(AppUntil.RequestApi("/auth/change-password"), {
                token, password: values.password
            }).then(
                (res) => {
                    if (res?.data?.isSuccess) {
                        onCloseSubmit()
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
        if (!value.password) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "password")
            isValid = false
        }
        if (!value.confirmPassword) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "confirmPassword")
            isValid = false
        } else if (value.password && value.confirmPassword !== value.password) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "confirmPassword", 3)
            isValid = false
        }
        !isValid && setErrorForm(newErrorForm)
        return isValid;
    }

    return <View>
        <Text style={{ textAlign: "center", fontSize: 24 }}>
            {headerTitle}
        </Text>
        <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
            Please change password because this is first login!
        </Text>
        <Formik
            initialValues={{}}
            onSubmit={(values) => onChangePassword(values)}
        >
            {
                ({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
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
                        <View style={{ marginBottom: 20 }}>
                            <TextInput
                                error={errorForm.confirmPassword.status}
                                label='Enter password'
                                mode='outlined'
                                secureTextEntry
                                onChangeText={handleChange('confirmPassword')}
                                onChange={() => {
                                    errorForm.confirmPassword.status && setErrorForm({
                                        ...errorForm,
                                        password: errorFormDefault.confirmPassword
                                    })
                                }}
                                onBlur={handleBlur('confirmPassword')}
                                left={<TextInput.Icon icon="key" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "confirmPassword")}
                        </View>
                        <Button
                            onPress={handleSubmit}
                            mode="contained"
                            color="#841584"
                        >
                            Login
                        </Button>
                    </View>


                )
            }

        </Formik>
    </View>
}
export default ChangePassword;