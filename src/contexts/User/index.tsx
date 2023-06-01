import { createContext, useReducer } from "react";
import { reducer } from "./reducer";
import { ContextType, DataType, ProviderType } from "./types";

export { useUserContext } from './hook';

const initialState: DataType = {
    user: null
}

export const UserContext = createContext<ContextType>({
    state: initialState,
    dispatch: () => {}
})

export const Provider = ({ children }: ProviderType) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = { state, dispatch };

    return (
        <UserContext.Provider value={ value }>
            {children}
        </UserContext.Provider>
    )
}