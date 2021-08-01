import { FieldError } from "../generated/graphql";

// FieldError에 있는 에러들을 가져와서 errorMap을 생성
export const toErrorMap = (errors: FieldError[]) => {
    // Record<Keys, Types> -> Key : valuetype의 인자들을 가지고 있는 object 생성
    const errorMap: Record<string, string> = {};
    errors.forEach(({field, message}) => {
        errorMap[field] = message;
    });

    return errorMap;
}