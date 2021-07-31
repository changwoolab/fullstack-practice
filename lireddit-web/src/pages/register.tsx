import React from "react";
import {Formik, Form} from "formik";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";
import { Box, Button, Input } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {

}

// 이 register mut을 useMutation에 넘겨주면 
// $username, $password 자리에 해당되는 인자를 넘겨주는 함수를 리턴해줌.
const REGISTER_MUT = `
mutation($username: String!, $password:String!){
    register(options: {username:$username, password: $password}) {
      errors{
        field
        message
      }
      user{
        id
        username
      }
    }
  }
`

const Register: React.FC<registerProps> = ({}) => {
    // REGISTER_MUT을 이용
    const [,register] = useMutation(REGISTER_MUT);
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }}
            onSubmit={async (values) => {
                // 여기서 response의 type을 제대로 알아내기 위해 graphql code generator을 사용.
                const response = await register(values);
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