# Introduction
A kit of hooks that simplify work with forms and fetch. Typescript is included out of box.

## Installation
NPM
> npm i vanilla-hooks yup react

YARN
> yarn add vanilla-hooks yup react


## How to use useVanillaForm
A react hook that uses dom for the best optimisation forms, it allows to work with large forms that consists of hundreds of inputs

### Using
The hook depends on package yup and react, so you should install the latest versions of yup, react to use it. Yup is needed to create common scheme

### Reason of creating
The hook was designed not looking at such popular instruments as formik and etcetera, because formik in comparing with current hook is very slow, because it uses hook 'useState' under the hood that can cope with large forms, it just lags. The hook has almost the same of functional formik, but it is faster in some times thanks dom

### Restrictions
These restrictions are temporary
* Type mixed isn't available
* 2D array aren'y available

### API

#### Parameters
`schema: ObjectSchema<Shape<any, any>>`
Yup schema is required to bind the form model(fields that have attribute "name") and validation.

`initialValues?: T`
The field isn't required, you can build form without initialisation values. The values will bind to name attributes of dom. For example company[0].sex = <input name="company[0].sex" />

`allFieldsExisted?: boolean`
The field is true by default, you should use to set the field as false, when your form is dynamic, otherwise it will give an error.

`onSubmit: (isValid: boolean, values: T, errors?: any) => void`
Function that handles after using handleSubmit

#### Returned Variables
`errors: string[]`
Yup mistakes. It will be more comfortable in the future as an object.

`handleSubmit: () => void`
Function that handles parameter onSubmit. Use with form

`getValuest(): T`
Return values in real time

### Examples
```jsx
import React from 'react';
import { useVanillaForm } from 'vanilla-hooks';
import { object, array, string, number, bool } from 'yup'

const yupSchema = object().shape({
    name: string(),
    age: number.max(20, "you need to be younger than 20",
    company: array().of(object({
        address: string(),
        name: string().required(),
        sex: bool()
    }))
});

function App() {
    const { errors, handleSubmit } = useVanillaForm({ // you can get errors inside submit or as the variable
        schema: yupSchema,
        onSubmit: (isValid, values, errors) => {
            if (isValid) {
                console.log("values", values);
            } else {
                console.log("errors", errors);
            }
        },
        allFieldsExisted: false,
        initialValues: { 
            name: "Giants",
            age: 2,
            company: [
                {
                    name: "Apple",
                    address: "somewhere",
                    sex: true
                },
                {
                    address: "anywhere"
                },
                {
                    sex: false
                }
            ]
        }
    });

    function submit(e) {
        e.preventDefault();
        handleSubmit();
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label>Name: </label>
                <input name="name" />
            </div>
            <div>
                <label>Age: </label>
                <input name="age" />
            </div>
            <div>
                <label>Companies: </label>
                <div>
                    <input name="company[0].name" />
                </div>
                <div>
                    <input name="company[0].sex" type="checkbox" />
                </div>
            </div>
            <button type="submit">Submit</button>
            {
                errors.map(error => <div>{error}</div>)
            }
        </form>
    );
}

export default App;
```

## How to use useVanillaFetch
The hook is not ready to production