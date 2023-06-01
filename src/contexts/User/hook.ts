import { useContext } from "react"
import { UserContext } from "."
import { User } from "../../types/User"
import { Actions } from "./types"

export const useUserContext = () => {
    const { state, dispatch } = useContext(UserContext)

    return {
        ...state,
        setUser: (user: User | null) => {
            dispatch({
                type: Actions.SET_USER,
                payload: { user }
            });
        }
    }
}