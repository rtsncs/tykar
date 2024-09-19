import { DefaultApi } from "./api/apis/DefaultApi";
import "./App.css";
import Header from "./components/header";

const api = new DefaultApi();
const health = await api.health();
console.log(health);

function App() {
  return (
    <>
      <Header />
      {health}
    </>
  );
}

export default App;
