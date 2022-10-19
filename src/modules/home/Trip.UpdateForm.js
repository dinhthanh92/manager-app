import { useEffect, useRef, useState } from "react";
import { AppUntil } from "../../../AppUntil";
import { Formik } from 'formik';
import { TextInput, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const errorFormDefault = AppUntil.ErrorDefautForm(["name", "startTime", "endTime"])

function TripUpdateForm({ headerTitle, onClose, tripId }) {
    const [errorForm, setErrorForm] = useState(errorFormDefault)
    const [initialValues, setSnitialValues] = useState({
        endTime: null,
        startTime: null,
        name: null
    })

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        axios.get(AppUntil.RequestApi("/trip/show/" + tripId), await AppUntil.RequsetHeader()).then(
            (res) => {
                if (res?.data?.isSuccess) {
                    const results = res.data?.results;
                    setSnitialValues({
                        endTime: moment(results?.endTime).format("DD-MM-YYYY"),
                        startTime: moment(results?.startTime).format("DD-MM-YYYY"),
                        name: results?.name
                    })
                }
            }
        )
    }

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

    const onUpdateTrip = async () => {
        let newValue = {
            ...initialValues,
        }
        if (checkValid(newValue)) {

            newValue = {
                ...newValue,
                startTime: moment(newValue?.startTime, "DD-MM-YYYY"),
                endTime: moment(newValue?.endTime, "DD-MM-YYYY")
            }

            axios.post(AppUntil.RequestApi("/trip/update/" + tripId), newValue, await AppUntil.RequsetHeader()).then(
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
        <View style={{ padding: 20 }}>
            <View style={{ marginBottom: 10 }}>
                <TextInput
                    error={errorForm.name.status}
                    value={initialValues.name}
                    label='Enter name'
                    mode='outlined'
                    onChangeText={(value) => {
                        setSnitialValues({ ...initialValues, name: value })
                    }}
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
                <TextInput
                    error={errorForm.startTime.status}
                    label='Enter start time (DD-MM-YYYY)'
                    mode='outlined'
                    value={initialValues.startTime}
                    onPressIn={() => {
                        showDatepicker("startTime")
                    }}
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
                    left={<TextInput.Icon icon="calendar" />}
                />
                {AppUntil.RenderMessageErrorForm(errorForm, "endTime")}
            </View>

            <Button
                onPress={() => onUpdateTrip()}
                style={{ marginTop: 10 }}
                mode="contained"
                color="#841584"
            >
                Update
            </Button>

        </View>
    </View>
}
export default TripUpdateForm;