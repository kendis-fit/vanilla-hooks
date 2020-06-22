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
    const parseForm = (schema, name) => {
        let formData = null;

        switch (schema.describe().type) {
            case types.object:
                formData = {};
                const fields = Object.keys(schema.fields);
                fields.forEach(field => formData[field] = parseForm(schema.fields[field], name ? `${name}.${field}` : field));
                break;
            case types.array:
                formData = [];
                break;
            case types.string:
            case types.date:
                const element = document.querySelector(`[name="${name}"]`);
                if (!allFieldsExisted) {
                    formData = element ? element.value : undefined;
                } else {
                    formData = element.value;
                }
                break;
            case types.bool:
            case types.boolean:
                const element = document.querySelector(`[name="${name}"]`);
                if (!allFieldsExisted) {
                    formData = element ? Boolean(element.checked) : undefined;
                } else {
                    formData = Boolean(element.checked);
                }
                break;
            case types.number:
                const element = document.querySelector(`[name="${name}"]`);
                if (!allFieldsExisted) {
                    formData = element ? Number(element.value) : undefined;
                } else {
                    formData = Number(element.value);
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