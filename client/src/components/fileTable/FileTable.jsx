import "./fileTable.css"
import { DataGrid } from "@material-ui/data-grid"
import { DeleteOutline } from "@material-ui/icons"
import { productRows } from "../../dummyData"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { updateTickerFilter } from "../../redux/updateTickerFilter"

export default function FileTable() {
  
  const tickerInfo = useSelector((state) => state.mainTicker.value)
  const [data, setData] = useState([])
  const [pageSize, setPageSize] = useState(20)

  useEffect(()=>{
    if(tickerInfo!=null) setData(tickerInfo.data)
   },[tickerInfo])

   const downloadId = (id) => {
    axios
      // .post(`http://localhost:5000/googleApi/download/` + id)
      .post(`http://www.frogdi.com/googleApi/download/` + id)
      .then((response) => {})
  }

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id))
  }

  const columns = [
    {
      field: "name",
      headerName: "File Name",
      width: 600,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {/* <img className="productListImg" src={params.row.img} alt="" /> */}
            {params.row.name}
          </div>
        )
      },
    },
    { field: "mimeType", headerName: "File Type", width: 200 },
    {
      field: "id",
      headerName: "Download",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <button
              className="productListDownload"
              onClick={() => downloadId(params.row.id)}
            >
              Download
            </button>
          </>
        )
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        )
      },
    },
  ]

  return (
    <div className="productList">
      <div className="tableTitle">
        {tickerInfo != null ? tickerInfo.info.name : ""} related files
      </div>
      <DataGrid
        rows={data}
        columns={columns}
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
      />
    </div>
  )
}
