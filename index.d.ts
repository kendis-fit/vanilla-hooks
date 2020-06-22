declare module "vanilla-hooks" {

    import { Dispatch, SetStateAction } from "react";

    interface IData<T> {
        data: T;
        setData: Dispatch<SetStateAction<T | undefined>>;
        loading: boolean;
        error: boolean;
    }

    function useVanillaFetch<T>(fetchMethod: () => Promise<T>): IData<T>;
}