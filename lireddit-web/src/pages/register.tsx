import React from "react";
import {Formik, Form} from "formik";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";
import { Box, Button, Input } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}


const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    // graphql code generator을 이용하여 graphql register을 hook으로서 쓰게 함.
    const [,register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }}
            onSubmit={async (values, {setErrors}) => {
                // 여기서 response의 type을 제대로 알아내기 위해 graphql code generator을 사용.
                const response = await register(values);
                // error 처리
                if (response.data?.register.errors) {
                  setErrors(toErrorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                  // register 성공하면 홈페이지로 돌아가기
                  router.push("/")
                }
                // return해줘야 submit이 완료된 것을 앎.
            }}
            >
            {({ isSubmitting}) => (
                <Form>
                    <InputField 
                    name="username"
                    placeholder="username"
                    label="Username"/>
                    <Box mt={4}>
                        <InputField
                        name="password"
                        placeholder="password"
                        label="Password"
                        type="password"
                        />
                    </Box>
                    <Button 
                        mt={4} 
                        type="submit"
                        isLoading={isSubmitting}
                        colorScheme="teal">
                            register
                    </Button>
                </Form>
            )}
        </Formik>
      </Wrapper>
    );
}
export default Register;