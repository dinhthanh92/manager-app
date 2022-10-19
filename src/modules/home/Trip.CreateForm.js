import { useRef, useState } from "react";
import { AppUntil } from "../../../AppUntil";
import { Formik } from 'formik';
import { TextInput, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const errorFormDefault = AppUntil.ErrorDefautForm(["name", "startTime", "endTime"])

function TripCreateForm({ headerTitle, onClose }) {
    const [errorForm, setErrorForm] = useState(errorFormDefault)
    const [date, setDate] = useState(new Date());
    const [initialValues, setSnitialValues] = useState({
        endTime: null,
        startTime: null,
    })

    const showMode = (currentDate, key, minimumDate, maximumDate) => {
        if (key === "endTime") {
            currentDate = initialValues.endTime ? currentDate : minimumDate
        }
        DateTimePickerAndroid.open({
            value: currentDate,
            maximumDate,
            minimumDate,
            mode: 'date',
            onChange: (value, date) => {
                if (key === "startTime") {
                    if (!initialValues.startTime || (moment(date).format("DD-MM-YYYY") !== initialValues.startTime)) {
                        initialValues?.endTime && setErrorForm({
                            ...AppUntil.SetErrorForm(errorForm, "endTime"),
                            startTime: {
                                status: false,
                                message: null
                            }
                        })
                        setSnitialValues({
                            ...initialValues,
                            [key]: moment(date).format("DD-MM-YYYY"),
                            endTime: null
                        })
                    }
                } else {
                    setSnitialValues({
                        ...initialValues,
                        [key]: moment(date).format("DD-MM-YYYY")
                    })
                    setErrorForm({
                        ...errorForm,
                        [key]: {
                            status: false,
                            message: null
                        }
                    })
                }
            }
        })
    };

    const onCreateTrip = async (valueForm) => {

        let newValue = {
            ...valueForm,
            ...initialValues
        }
        if (checkValid(newValue)) {
            newValue = {
                ...newValue,
                startTime: moment(newValue?.startTime, "DD-MM-YYYY"),
                endTime: moment(newValue?.endTime, "DD-MM-YYYY")
            }
            axios.post(AppUntil.RequestApi("/trip/create"), newValue, await AppUntil.RequsetHeader()).then(
                (res) => {
                    if (res?.data?.statusCode === 200) {
                        onClose()
                    }
                }
            ).catch(
                (err) => {

                }
            )
        }
    }

    const checkValid = (values) => {
        let isValid = true;
        let newErrorForm = { ...errorForm }
        if (!values.endTime) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "endTime")
            isValid = false
        }
        if (!values.startTime) {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "startTime")
            isValid = false
        }
        if (!values.name || values?.name?.trim() === "") {
            newErrorForm = AppUntil.SetErrorForm(newErrorForm, "name")
            isValid = false
        }
        !isValid && setErrorForm(newErrorForm)
        return isValid;
    }

    const showDatepicker = (key) => {
        let currentDate = initialValues?.[key] ? moment(initialValues?.[key], "DD-MM-YYYY") : new Date();
        let minDate = null
        if (key === "endTime") {
            minDate = moment(initialValues?.startTime, "DD-MM-YYYY")
        }
        showMode(new Date(currentDate), key, new Date(minDate));
    };

    return <View>
        <Text style={{ textAlign: "center", fontSize: 24 }}>
            {headerTitle}
        </Text>
        <Formik
            initialValues={{}}
            onSubmit={(values) => onCreateTrip(values)}
        >
            {
                ({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={{ padding: 20 }}>
                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                error={errorForm.name.status}
                                label='Enter name'
                                mode='outlined'
                                onChangeText={handleChange("name")}
                                onChange={() => {
                                    errorForm.name.status && setErrorForm({
                                        ...errorForm,
                                        name: errorFormDefault.name
                                    })
                                }}
                                onBlur={handleBlur('name')}
                                left={<TextInput.Icon icon="pencil" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "name")}
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                error={errorForm.startTime.status}
                                label='Enter start time (DD-MM-YYYY)'
                                mode='outlined'
                                value={initialValues.startTime}
                                onPressIn={() => {
                                    showDatepicker("startTime")
                                }}
                                onChangeText={handleChange("startTime")}
                                onBlur={handleBlur('startTime')}
                                left={<TextInput.Icon icon="calendar" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "startTime")}
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                error={errorForm.endTime.status}
                                label='Enter end time (DD-MM-YYYY)'
                                value={initialValues.endTime}
                                editable={initialValues.startTime ? true : false}
                                mode='outlined'
                                onPressIn={() => {
                                    showDatepicker("endTime")
                                }}
                                onChangeText={handleChange("endTime")}
                                onBlur={handleBlur('endTime')}
                                left={<TextInput.Icon icon="calendar" />}
                            />
                            {AppUntil.RenderMessageErrorForm(errorForm, "endTime")}
                        </View>

                        <Button
                            onPress={handleSubmit}
                            style={{ marginTop: 10 }}
                            mode="contained"
                            color="#841584"
                        >
                            Create
                        </Button>

                    </View>
                )
            }
        </Formik >
    </View>
}
export default TripCreateForm;