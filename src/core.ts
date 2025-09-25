import rulesSchema from "#/rules/k-i18n-rules.schema.json";
import type { TranslationConfig } from "#/types";
import Translator from "#/translator";
import Ajv from "ajv";

const ajv = new Ajv();
ajv.addSchema(rulesSchema, "rules-schema");

export function getAjv(): Ajv {
    return ajv;
}

export function getTranslator(config: TranslationConfig): Translator {
    return new Translator(config);
}
