import axios from 'axios';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    Modal,
    Text,
    View, LogBox
} from 'react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { AppUntil } from '../../../AppUntil';
import _ from "lodash"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';



function TripDetailChart({ headerTitle, tripId, onClose }) {

    // Ignore log notification by message
    LogBox.ignoreLogs(['Warning: ...']);

    //Ignore all log notifications
    LogBox.ignoreAllLogs();



    const [dataChart, setDataChart] = useState([])




    const [dataChartTime, setDataChartTime] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        axios.all([
            axios.get(AppUntil.RequestApi("/destination/dashboard"), {
                ...await AppUntil.RequsetHeader(),
                params: {
                    tripId
                }
            }),
            axios.get(AppUntil.RequestApi("/destination/dashboard-time"), {
                ...await AppUntil.RequsetHeader(),
                params: {
                    tripId
                }
            }),
        ]).then(
            ([res1, res2]) => {
                if (res1?.data?.isSuccess && res2?.data?.isSuccess) {
                    setDataChart(res1?.data?.results)
                    setDataChartTime(res2?.data?.results)
                }
            }
        )
    }


    return <View style={{ height: 650 }}>

        <Text style={{ textAlign: "center", fontSize: 24 }}>
            {headerTitle}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View>
                {
                    //ts
                    <PieChart
                        data={dataChart}
                        key={"chartpie"}
                        donut
                        labelsPosition="outward"
                        centerLabelComponent={() => (
                            <View>
                                <Text>$ {_.sumBy(dataChart, x => x.price)}</Text>
                            </View>
                        )}
                        showValuesAsLabels={true}
                        showText
                        textColor='black'
                    />
                }
            </View>
            <View>
                <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: "600" }}>Type Destination</Text>
                <View style={{ flexDirection: "row" }}>
                    <Icon name="circle" color={dataChart[0]?.color} />
                    <Text style={{ marginLeft: 5 }}>
                        {dataChart[0]?.type}
                    </Text>
                </View>
                <View style={{ marginTop: 10, marginBottom: 10, flexDirection: "row" }}>
                    <Icon name="circle" color={dataChart[1]?.color} />
                    <Text style={{ marginLeft: 5 }}>
                        {dataChart[1]?.type}
                    </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Icon name="circle" color={dataChart[2]?.color} />
                    <Text style={{ marginLeft: 5 }}>
                        {dataChart[2]?.type}
                    </Text>
                </View>
            </View>
        </View>

        {/* <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <View style={{}}>
                    <Button onPress={showPicker} mode="contained" >
                        Select date
                    </Button>
                </View>
            </View>

        </View> */}
        <View>
            <Text style={{ marginBottom: 10, fontSize: 18 }}>Daily destination</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }} >
                <BarChart
                    autoShiftLabels={true}
                    stackData={dataChartTime}
                    areaChart
                    width={300}
                    barWidth={60}
                    xAxisIndicesWidth={200} />
            </View>
        </View>
        <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
                <Icon name="circle" color={dataChart[0]?.color} />
                <Text style={{ marginLeft: 5 }}>
                    {dataChart[0]?.type}
                </Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
                <Icon name="circle" color={dataChart[1]?.color} />
                <Text style={{ marginLeft: 5 }}>
                    {dataChart[1]?.type}
                </Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: 'flex-end' }}>
                <Icon name="circle" color={dataChart[2]?.color} />
                <Text style={{ marginLeft: 5 }}>
                    {dataChart[2]?.type}
                </Text>
            </View>
        </View>
        <View style={{ marginTop: 20 }}>
            <Button mode="contained" onPress={() => onClose()}>Close</Button>
        </View>
    </View>
}
export default TripDetailChart;