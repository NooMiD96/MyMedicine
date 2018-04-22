export default (fieldsError: any): boolean =>
    Object.keys(fieldsError).some(field => fieldsError[field]);
