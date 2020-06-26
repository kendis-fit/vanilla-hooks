import { useState, useEffect } from "react";

const types = {
    object: "object",
    array: "array",
    string: "string",
    boolean: "boolean",
    bool: "bool",
    number: "number",
    date: "date"
}

function useVanillaForm({ schema, onSubmit, initialValues, valuesAnyway = false, allFieldsExisted = true }) {
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        const fillForm = (initVals, name) => {
            if (typeof initVals === "object") {
                if (initVals.length) { // if it is an array
                    initVals.forEach((value, index) => {
                        if (typeof value === "object") {
                            const fields = Object.entries(value);
                            fields.forEach(([key, val]) => fillForm(val, name ? `${name}[${index}].${key}` : `[${index}].${key}`));
                        } else {
                            fillForm(value, name ? `${name}[${index}]` : `[${index}]`);
                        }
                    });
                } else {
                    const fields = Object.entries(initVals);
                    fields.forEach(([key]) => fillForm(initVals[key], name ? `${name}.${key}` : key));
                }
            } else {
                const isBoolean = typeof initVals === "boolean";
                const element = document.querySelector(`[name="${name}"]`);
                if (element) {
                    element[isBoolean ? "checked" : "value"] = initVals;
                }
            }
        }
        fillForm(initialValues);
    }, []);

    const convertType = (type, value) => {
        switch (type) {
            case types.bool:
            case types.boolean:
                return Boolean(value);
            case types.number:
                return Number(value);
            default:
                return value;
        }
    }

    const parseForm = (schema, name) => {
        const typeSchema = schema.describe().type;
        let formData = undefined;

        switch (typeSchema) {
            case types.object:
                const fieldObj = {};
                const fields = Object.keys(schema.fields);
                fields.forEach(field => {
                    let fieldValue = parseForm(schema.fields[field], name ? `${name}.${field}` : field);
                    if (typeof fieldValue !== "undefined") {
                        fieldObj[field] = fieldValue;
                    }
                });
                if (Object.keys(fieldObj).length > 0) {
                    formData = fieldObj;
                }
                break;
            case types.array:
                formData = [];
                let i = 0;
                while (true) {
                    const elements = document.querySelectorAll(`[name*="${name ? name : ""}[${i}]"]`);
                    if (elements.length > 0) {
                        if (schema._subType.fields) { // if child is an object
                            const fields = Object.keys(schema._subType.fields);
                            const fieldObj = {};
                            fields.forEach(field => {
                                const fieldSchema = schema._subType.fields[field];
                                const fieldName = `${name ? name : ""}[${i}].${field}`;
                                const fieldValue = parseForm(fieldSchema, fieldName); 
                                if (typeof fieldValue !== "undefined") {
                                    fieldObj[field] = fieldValue;
                                }
                            });
                            if (Object.keys(fieldObj).length > 0) {
                                formData.push(fieldObj);
                            }
                        } else { // it means schema consists of primary type
                            const type = schema._subType._type;
                            const isBoolean = typeSchema === types.bool || typeSchema === types.boolean;
                            formData.push(convertType(type, elements[0][isBoolean ? "checked" : "value"]));
                        }
                        ++i;
                    } else {
                        if (i === 0) {
                            formData = undefined;
                        }
                        break;
                    }
                }
                break;
            case types.string:
            case types.date:
            case types.bool:
            case types.boolean:
            case types.number:
                const element = document.querySelector(`[name="${name}"]`);
                const isBoolean = typeSchema === types.bool || typeSchema === types.boolean;
                if (!allFieldsExisted) {
                    formData = element ? convertType(typeSchema, element[isBoolean ? "checked" : "value"]) : undefined;
                } else {
                    formData = convertType(typeSchema, element[isBoolean ? "checked" : "value"]);
                }
                break;
        }

        return formData;
    }

    const handleSubmit = () => {
        const formData = parseForm(schema);
        const formOpts = {
            abortEarly: false
        }
        const errors = {};

        schema
            .validate(formData, formOpts)
            .then(() => {
                onSubmit(true, formData);
            })
            .catch(err => {
                err.inner.forEach(e => errors[e.path] = e.message);
                onSubmit(false, valuesAnyway ? formData : null, errors);
            })
            .finally(() => setErrors(errors));

    };

    const getValues = () => parseForm(schema);

    return { errors, handleSubmit, getValues };
}

export default useVanillaForm;