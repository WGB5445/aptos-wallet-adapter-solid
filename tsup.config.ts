// tsup.config.ts
import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'

const preset_options: preset.PresetOptions = {
    entries: [
        {
            entry: 'src/index.tsx',
        },
    ],
    drop_console: true,
    cjs: true,
}

export default defineConfig(config => {
    const watching = !!config.watch

    config.clean = true

    const parsed_data = preset.parsePresetOptions(preset_options, watching)

    if (!watching) {
        const package_fields = preset.generatePackageExports(parsed_data)

        console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`)

        /*
            will update ./package.json with the correct export fields
        */
        preset.writePackageJson(package_fields)
    }

    return preset.generateTsupOptions(parsed_data)
})