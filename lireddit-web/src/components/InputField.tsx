import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { Form, useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};

// "" => false
// "error message stuff" => true

export const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
    // [상태, 매서드]
    const [field, {error}] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input 
            {...field}
            {...props}
            id={field.name} placeholder={props.placeholder}/>
            {error?<FormErrorMessage>{error}</FormErrorMessage>:null}
        </FormControl>
    );
}