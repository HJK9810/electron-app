import "./App.scss";
import Layout from "./Layout/Layout";
import Main from "./Screen/Main.Screen";

function App() {
  return (
    <div className="App">
      <Layout>
        <Main />
      </Layout>
    </div>
  );
}

export default App;
