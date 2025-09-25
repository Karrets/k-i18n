import { assert, assertType, expect, expectTypeOf, test } from 'vitest'
import { getAjv } from "../src/core"
import rules from "../src/rules/k-i18n-rules.json"
import { PluralizationRules } from "../src/types"

test("Language Rules", () => {
    const ajv = getAjv();
    const validateRules = ajv.getSchema<PluralizationRules>("rules-schema");

    if (!validateRules) assert.fail("Validate Rules missing? Not Truthy")
    validateRules(rules);
})