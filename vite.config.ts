/// <reference types="vitest/config" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'k-i18n',
            fileName: 'k-i18n'
        }
    },
    plugins: [dts()]
});