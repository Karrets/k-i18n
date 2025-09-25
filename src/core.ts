import rulesSchema from "#/rules/k-i18n-rules.schema.json";

import Ajv from "ajv";

const ajv = new Ajv();
ajv.addSchema(rulesSchema, "rules-schema");

export function getAjv(): Ajv {
    return ajv;
}

