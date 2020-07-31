declare module "vanilla-hooks" {

    import { ObjectSchema, Shape } from "yup";
    import { Dispatch, SetStateAction } from "react";

    type DynamicObjectErrors = { [key: string]: string };

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
        valuesAnyway?: boolean;
        allFieldsExisted?: boolean;
        onSubmit: (isValid: boolean, values: T, errors?: any) => void;
    }

    interface IFormResult<T> {
        errors: DynamicObjectErrors;
        handleSubmit: () => void;
        setValues: () => void;
        getValues: () => T;
    }

    function useVanillaForm<T>(form: IForm<T>): IFormResult<T>;
}