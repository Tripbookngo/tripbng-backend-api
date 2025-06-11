export const isNull = (fields) => {
    return fields.some(field => field === undefined || field === null || field === "");
};
