const types = {
    object: "object",
    array: "array",
    string: "string",
    boolean: "boolean",
    bool: "bool",
    number: "number",
    date: "date"
}

function useVanillaForm({ schema, onSubmit }) {
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
                formData = document.querySelector(`[name="${name}"]`).value;
                break;
            case types.bool:
            case types.boolean:
                formData = Boolean(document.querySelector(`[name="${name}"]`).checked);
                break;
            case types.number:
                formData = Number(document.querySelector(`[name="${name}"]`).value);
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