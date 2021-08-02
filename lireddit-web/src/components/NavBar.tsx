import { Box } from "@chakra-ui/layout";
import { Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({
        pause:isServer(),
    });
    let body = null;
    // data is loading
    if (fetching) {
        body = null;
    } else if (!data?.me) { // user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2} color="white">login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">Register</Link>
                </NextLink>
            </>
        );
    } else { // user is logged in
        body = (
            <>
                <Flex>
                    <Box mr={2}>{data.me.username}</Box>
                    <Button 
                    onClick={()=> {logout();}} 
                    isLoading={logoutFetching}
                    variant="link">Logout</Button>
                </Flex>
            </>
        );
    }
    return (
        <Flex bg="tomato" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    );
}