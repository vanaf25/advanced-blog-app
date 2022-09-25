import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class TypePostValidator implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text==="popular" || text==="new" || text==="" ; // for async validations you must return a Promise<boolean> here
    }

    defaultMessage(args: ValidationArguments) {
        return 'The value must be popular or new';
    }
}
