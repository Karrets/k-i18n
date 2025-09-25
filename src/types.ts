/**
 * @fileoverview TypeScript interfaces for k-i18n pluralization rules.
 * Generated from the JSON schema.
 */

/**
 * A single condition to be evaluated as part of a pluralization rule.
 * All conditions within a group must be met (AND logic).
 */
export interface PluralizationCondition {
    /**
     * The variable to test (e.g., 'n' for the number, 'n % 10' for modulo).
     */
    operand: string;

    /**
     * The comparison operator.
     */
    operator: 'is' | 'is_not' | 'in_range' | 'not_in_range';

    /**
     * The value to test against. This can be a single number or an array
     * of two numbers representing a range (inclusive).
     */
    value: number | number[];
}

/**
 * An array of condition groups.
 * All conditions within a group must be true (AND).
 * The groups themselves are evaluated with OR logic.
 *
 * @example
 * // Represents: (n is 1 AND n % 10 is 1) OR (n is 2)
 * const rule: PluralizationRule = [
 * [
 * { operand: 'n', operator: 'is', value: 1 },
 * { operand: 'n % 10', operator: 'is', value: 1 }
 * ],
 * [
 * { operand: 'n', operator: 'is', value: 2 }
 * ]
 * ];
 */
export type PluralizationRule = PluralizationCondition[][];

/**
 * Defines the pluralization rules for a specific locale. Each property
 * represents a CLDR plural category.
 */
export interface LocalePluralizationRules {
    zero?: PluralizationRule;
    one?: PluralizationRule;
    two?: PluralizationRule;
    few?: PluralizationRule;
    many?: PluralizationRule;
}

/**
 * The root object that defines the grammatical pluralization rules for different locales.
 * Keys are locale codes matching the pattern '^[a-z]{2}(-[A-Z]{2})?$', as well as a default rule for most languages.
 */
export interface PluralizationRules {
    default: LocalePluralizationRules;
    [locale: string]: LocalePluralizationRules | undefined;
}
