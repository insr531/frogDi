import "./stockChart.css"
import { useEffect, useState, useRef } from "react"
import Chart from "react-apexcharts"
import { useSelector, useDispatch } from "react-redux"

export default function StockChart() {
  const tickerInfo = useSelector((state) => state.stockChart.value)
  const [newData, SetNewData] = useState({})

  useEffect(() => {
    if (tickerInfo != null) {
      SetNewData(tickerInfo)
    }
  }, [tickerInfo])

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }

  return (
    <div className="Chart">
      <Chart options={options} series={newData} type="candlestick" />
    </div>
  )
}
