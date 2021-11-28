import "./App.css";
import RouterPage from "./router";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ToastProvider } from "react-toast-notifications";
import { Provider } from "react-redux";
import { store, persist } from "./redux/store";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persist}>
        <ToastProvider autoDismiss autoDismissTimeout={3000}>
          <ChakraProvider>
            <div className="app">
              <RouterPage />
            </div>
          </ChakraProvider>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
