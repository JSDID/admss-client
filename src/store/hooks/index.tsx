import { useContext } from "react";
import { RootStore } from "store";
import { StoreContext } from "store/context";

export const useStore = (): RootStore => useContext(StoreContext);
