declare module "vanilla-hooks" {

    import { ObjectSchema, Shape, object, any } from "yup";
    import { Dispatch, SetStateAction } from "react";

    interface IData<T> {
        data: T;
        setData: Dispatch<SetStateAction<T | undefined>>;
        loading: boolean;
        error: boolean;
    }

    function useVanillaFetch<T>(fetchMethod: () => Promise<T>): IData<T>;

    interface IForm<T>{
        schema: ObjectSchema<Shape<any, any>>;
        onSubmit: (isValid: boolean, values: T) => void;
    }

    function useVanillaForm<T>(form: IForm<T>): { handleSubmit: () => void };
}