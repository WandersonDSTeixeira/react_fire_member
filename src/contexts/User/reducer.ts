import { DataType, ActionType, Actions } from "./types";

export const reducer = (state: DataType, action: ActionType) => {
    switch (action.type) {     
        case Actions.SET_USER:
            if (!action.payload.user) return { ...state, user: null };
            return { ...state, user: action.payload.user };
        default: return state;
    }
}