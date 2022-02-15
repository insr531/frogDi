import "./home.css";
import StockChart from "../../components/stockChart/StockChart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import FileTable from "../../components/fileTable/FileTable";

export default function Home() {

  return (
    <div className="home">
      <FeaturedInfo />
      <StockChart />
      <div className="homeTable">
        <FileTable />
      </div>
    </div>
  );
}