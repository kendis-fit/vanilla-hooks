declare module "vanilla-hooks" {

    import { ObjectSchema, Shape } from "yup";
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
        initialValues?: T;
        allFieldsExisted?: boolean;
        onSubmit: (isValid: boolean, values: T, errors?: any) => void;
    }

    interface IFormResult<T> {
        handleSubmit: () => void;
        getValuest(): T;
    }

    function useVanillaForm<T>(form: IForm<T>): IFormResult<T>;
}