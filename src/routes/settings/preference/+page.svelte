<script lang="ts">
    import { settings } from '@stores'
    import { SettingLayout, SettingRow } from '@modules'
    import { Chip, TextField, Toggle, OpenGraph } from '@shared'
    import { tags } from '@services'

    const addPreference = (value: string) => {
        settings.update((v) => ({
            ...v,
            preference: {
                ...v.preference,
                data: [...new Set(v.preference.data).add(value)]
            }
        }))
    }

    const removePreference = (value: string) => {
        const data = new Set($settings.preference.data)
        data.delete(value)

        settings.update((v) => ({
            ...v,
            preference: {
                ...v.preference,
                data: [...data]
            }
        }))
    }

    const toggleTag = (value: string) => () => {
        if ($settings.preference.data.includes(value)) removePreference(value)
        else addPreference(value)
    }

    $: applyActive = (value: string) =>
        $settings.preference.data.includes(value)
            ? 'text-white bg-blue-500 dark:bg-blue-600 border-transparent'
            : 'text-gray-700 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700'

    $: disabled = !$settings.preference.enable
    $: disabledClass = disabled ? 'opacity-50 pointer-events-none' : ''
</script>

<OpenGraph noIndex />

<SettingLayout
    title="Preference"
    label="Add your own tags preference for finding hentai on discover page."
>
    <SettingRow title="Enable">
        <svelte:fragment slot="label">
            <p>Allow custom preference.</p>
            <p>Disable this will not removed preference you have added.</p>
        </svelte:fragment>
        <Toggle class="mt-10" bind:value={$settings.preference.enable} />
    </SettingRow>

    <article class="flex flex-col w-full gap-4 text-gray-500 {disabledClass}">
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            My preferences
        </h3>
        <p>Type down tags you had like to read.</p>
        <TextField
            id="preference"
            name="preference"
            label="My preference"
            placeholder="Preference, eg. yuri, futa, etc."
            {disabled}
            onChange={addPreference}
        />

        <section class="flex gap-1.5 flex-wrap w-full">
            {#each $settings.preference.data.filter((t) => !tags.includes(t)) as preference}
                <Chip value={preference} onRemove={removePreference} />
            {/each}
        </section>
    </article>

    <article
        class="flex flex-col w-full gap-4 text-gray-500 {disabledClass}"
        aria-disabled={disabled}
    >
        <p>Or you can choose from top 100 tags.</p>
        <section class="flex gap-1.5 flex-wrap w-full">
            {#each tags as tag}
                <button
                    class="px-3 py-1 rounded-full border {applyActive(
                        tag
                    )} transition-colors"
                    {disabled}
                    on:click={toggleTag(tag)}>{tag}</button
                >
            {/each}
        </section>
    </article>
</SettingLayout>
