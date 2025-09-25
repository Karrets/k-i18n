import type { TranslationConfig } from "./types";

export default class Translator {
    private config: TranslationConfig;

    constructor(config: TranslationConfig) {
        this.config = config;

        //TODO: Load language files, set up pluralization rules, etc.
    }
}