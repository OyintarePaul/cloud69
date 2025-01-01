import ReactModal from "react-modal";
import Providers from "./providers";

ReactModal.setAppElement("#root");

const App = () => {
  return (
    <>
      <Providers />
    </>
  );
};
export default App;
