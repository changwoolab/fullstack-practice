import React from "react";
import {Formik, Form} from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}


const Login: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    // graphql code generator을 이용하여 graphql register을 hook으로서 쓰게 함.
    const [,login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }}
            onSubmit={async (values, {setErrors}) => {
                // 여기서 response의 type을 제대로 알아내기 위해 graphql code generator을 사용.
                const response = await login({options: values});
                // error 처리
                if (response.data?.login.errors) {
                  setErrors(toErrorMap(response.data.login.errors));
                } else if (response.data?.login.user) {
                  // register 성공하면 홈페이지로 돌아가기
                  router.push("/")
                }
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
                            login
                    </Button>
                </Form>
            )}
        </Formik>
      </Wrapper>
    );
}
export default withUrqlClient(createUrqlClient)(Login);