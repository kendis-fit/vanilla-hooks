const types = {
    object: "object",
    array: "array",
    string: "string",
    boolean: "boolean",
    bool: "bool",
    number: "number",
    date: "date"
}

function useVanillaForm({ schema, onSubmit, allFieldsExisted = true }) {
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
        let formData = null;

        switch (typeSchema) {
            case types.object:
                formData = {};
                const fields = Object.keys(schema.fields);
                fields.forEach(field => formData[field] = parseForm(schema.fields[field], name ? `${name}.${field}` : field));
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
                                fieldObj[field] = parseForm(fieldSchema, fieldName);
                            });
                            formData.push(fieldObj);
                        } else { // it means schema consists of primary type
                            const type = schema._subType._type;
                            formData.push(convertType(type, elements[0].value));
                        }
                        ++i;
                    } else {
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
                if (!allFieldsExisted) {
                    formData = element ? convertType(typeSchema, element.value) : undefined;
                } else {
                    formData = convertType(typeSchema, element.value);
                }
                break;
        }

        return formData;
    }

    const handleSubmit = () => {
        const formData = parseForm(schema);

        schema
            .validate(formData)
            .then(values => {
                onSubmit(true, values);
            })
            .catch(err => {
                onSubmit(false, null, err.errors);
            });

    };

    const getValues = () => parseForm(schema);

    return { handleSubmit, getValues };
}

export default useVanillaForm;