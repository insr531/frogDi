import "./fileTable.css"
import { DataGrid } from "@material-ui/data-grid"
import { DeleteOutline } from "@material-ui/icons"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function FileTable() {
  
  const tickerInfo = useSelector((state) => state.mainTicker.value)
  const [data, setData] = useState([])
  const [pageSize, setPageSize] = useState(20)

  useEffect(()=>{
    if(tickerInfo!=null) setData(tickerInfo.data)
   },[tickerInfo])

  const openId = (id) => {
    const url = "https://drive.google.com/file/d/" + id + "/view"
    window.open(url, '_blank').focus();
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
      headerName: "Open",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <button
              className="productListOpen"
              onClick={() => openId(params.row.id)}
            >
              Open
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
