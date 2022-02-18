import "./featuredInfo.css"
import { useEffect, useState } from "react"
import { ArrowDownward, ArrowUpward } from "@material-ui/icons"
import { TextField, Tooltip } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { updateTickerFilter } from "../../redux/updateTickerFilter"
import { updateStockChart } from "../../redux/updateStockChart"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { tickerListData } from "../../dataGoogleApi/tickerListData"
import axios from "axios"

export default function FeaturedInfo() {
  const [tickerFilter, setTickerFilter] = useState({
    info: tickerListData[0],
    data: {},
  })
  const dispatch = useDispatch()
  const [stockPriceData, SetstockPriceData] = useState({})
  
  const fetchGoogleFolder = (ticker) => {
    axios
    
    // .post(`http://localhost:3000/googleApi/readFolder/` + ticker.gid)
      .post(`/googleApi/readFolder/` + ticker.gid)
      .then((response) => {
        const dataForm = { info: ticker, data: response.data }
        setTickerFilter(dataForm)
        dispatch(updateTickerFilter(dataForm))
      })
  }

  const fetchAlphavantage = (stockSymbol) => {
    const API_KEY = "HGJWFG4N8AQ66ICD"
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=60min&slice=year2month12&outputsize=full&apikey=${API_KEY}`
    
    fetch(API_Call)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let pushData = []
        for (var key in data["Time Series (60min)"]) {
          pushData.push({
            x: key,
            y: [
              Math.ceil(data["Time Series (60min)"][key]["1. open"] * 10) / 10,
              Math.ceil(data["Time Series (60min)"][key]["2. high"] * 10) / 10,
              Math.ceil(data["Time Series (60min)"][key]["3. low"] * 10) / 10,
              Math.ceil(data["Time Series (60min)"][key]["4. close"] * 10) / 10,
            ],
          })
        }
        let compareData =  {
          "currentPrice" : pushData[0]["y"][0],
          "compareLastYear": Math.ceil((pushData[0]["y"][0] - pushData[pushData.length-1]["y"][0]) *10)/10
        }

        SetstockPriceData(compareData)
        dispatch(updateStockChart([{ data: pushData }]))

      })
  }

  var initialValue = 0
  const defaultFilter = tickerListData[0]

  useEffect(() => {
    if (initialValue++ === 0) onChangeFilter(defaultFilter)
  }, [])

  const onChangeFilter = (ticker) => {
    if (ticker != null) 
    { 
      fetchAlphavantage(ticker.symbol)
      fetchGoogleFolder(ticker)
    }
  }

  return (
    <div className="featured">
      <Tooltip title="Free Alpha Vantage API call frequency is 5 calls per minute">
        <div className="featuredItem">
          <span className="featuredTitle"></span>
          <div>
            <Autocomplete
              defaultValue={defaultFilter}
              onChange={(event, value) => onChangeFilter(value)}
              disablePortal
              id="tickerFilter"
              options={tickerListData}
              getOptionLabel={(option) => option.title}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search for symbols or companies"
                />
              )}
            />
          </div>
        </div>
      </Tooltip>
      <div className="featuredItem">
        <img
          className="titleImg"
          src={tickerFilter != null ? tickerFilter.info.avatar : ""}
          alt=""
        />
        <span className="companyTitle">
          {tickerFilter != null ? tickerFilter.info.name : ""}
        </span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Current Price</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${stockPriceData.currentPrice}</span>
          <span className="featuredMoneyRate">
            ${stockPriceData.compareLastYear}
            {stockPriceData.compareLastYear > 0 ? (
              <ArrowUpward className="featuredIcon" />
            ) : (
              <ArrowDownward className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last year</span>
      </div>
    </div>
  )
}
