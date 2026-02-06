import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "../services/api";
import { loginSuccess, logout } from "../store/reducers/authReducer";
import type { AppDispatch } from "../store/store";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await api.get("/auth/me");
                dispatch(loginSuccess({ token, user: res.data }));
            } catch (error) {
                console.error("Session verification failed", error);
                dispatch(logout());
            }
        };

        initAuth();
    }, [dispatch]);

    return <>{children}</>;
}
