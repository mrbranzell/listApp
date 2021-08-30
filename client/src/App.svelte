<!-- This app does too much for me to explain righ now.. but i will, i will -->
<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import SettingsIcon from './components/imageComponents/settingsIcon.svelte';
    import X from './components/imageComponents/X.svelte';

    let userLaguage = localStorage.getItem('userLaguage') ? localStorage.getItem('userLaguage') : 'swe';

    function handleLaguageChange(e) {
        localStorage.setItem('userLaguage', e.target.value);
        userLaguage = localStorage.getItem('userLaguage');
        openSettings = !openSettings;
    }

    // 🗣🗣🗣🗣🗣 all the laguage switching stuff
    let UIlang =
        userLaguage === 'swe'
            ? {
                  id: 0,
                  lang: { source: 'Svenska', target: 'Português', abbreviated: `sv-pt` },
                  lista: { source: 'Lista', target: 'Lista' },
                  tranTraned: { source: 'Översätt', target: 'Traduzir' },
              }
            : {
                  id: 1,
                  lang: { source: 'Português', target: 'Svenska', abbreviated: `pt-sv` },
                  lista: { source: 'Lista', target: 'Lista' },
                  tranTraned: { source: 'Traduzir', target: 'Översätt' },
              };

    let input;
    let items = [];
    let openSettings = true;
    $: disabled = !input;

    // FUNCTIONS

    onMount(async () => {
        const { data } = await axios.get('/api/items');
        items = data;
    });
    // ➕➕➕
    const addItem = async () => {
        const translationConf = {
            value: input,
            fromTo: UIlang.lang.abbreviated,
        };
        const translated = await axios.post('/api/translation', translationConf);

        if (translated) {
            const item = {
                date: new Date().getTime(),
                bought: false,
                lang1: input,
                fromTo: UIlang.lang.abbreviated,
                lang2: translated.data,
            };

            const response = await axios.post('/api/items', item);
            items = [response.data, ...items];
            input = '';
        }
    };
    // 🛒🛒🛒🛒🛒🛒
    const boughtItem = async (id, bought) => {
        const response = await axios.patch('/api/items/' + id, { bought: !bought });

        if (response.data.id === id) {
            //console.log(JSON.stringify(response.data))
            let item = items.find((d) => d._id === id);
            item.bought = !bought;
            items.find((d) => d._id === id).bought = item.bought;
            // needed to update the dom https://svelte.dev/tutorial/updating-arrays-and-objects
            items = items;
        }
    };
    // ❌❌❌❌❌
    async function removeItem(id) {
        const response = await axios.delete('/api/items/' + id);
        if (response.data.id === id) {
            items = items.filter((t) => t._id !== id);
        }
    }
</script>

<div>
    <div class="app">
        <div on:click={() => (openSettings = !openSettings)} class={!openSettings && 'fullBackground'} />
        <aside class={`${openSettings && 'goneSettings'} card settings`}>
            <div class="language-selector">
                <h2>Välj språk</h2>
                <select on:change={handleLaguageChange} value={userLaguage}>
                    <option value="swe">Svenska ⇾ Português</option>
                    <option value="por">Português ⇾ Svenska</option>
                </select>
            </div>
        </aside>

        <section class="card">
            <div class="settingIcon" on:click={() => (openSettings = !openSettings)}><SettingsIcon /></div>

            <h1 class="title">
                {UIlang.lista.source}/{UIlang.lista.target}
            </h1>
            <div class="rows">
                <div class="inputWrapper itemWrapper">
                    <input class="input" type="text" placeholder="Item" bind:value={input} />
                    <button class="btn" on:click={addItem} {disabled}>save</button>
                </div>
                {#each items as item (item._id)}
                    <div class="item itemWrapper">
                        <div class="deleteBtn" on:click={() => removeItem(item._id)}><X /></div>
                        <div
                            class="text {item.bought ? 'lineThrough' : ''}"
                            on:click={() => boughtItem(item._id, item.bought)}
                        >
                            <p>{item.lang1}</p>
                            <p>{item.lang2}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </section>
    </div>
</div>

<style>
    .goneSettings {
        display: none;
    }

    .settingIcon {
        position: relative;
        top: 15px;
        left: 100%;
        width: 30px;
    }
    .settings {
        position: fixed;
        z-index: 10;
    }
    .fullBackground {
        z-index: 1;
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .title {
        text-align: center;
        margin-top: 0;
    }
    .card {
        background-color: var(--secondaryColor);
        width: 300px;
        height: fit-content;
        margin-top: 50px;
        padding: 0 50px 50px 50px;
        border-radius: 40px 40px 60px 20px;
        border: 6px solid var(--black);
        box-shadow: 35px 35px 0px 4px var(--primaryColor), 35px 35px 0px 10px var(--black);
    }
    .lineThrough {
        text-decoration: line-through;
    }
    .app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background-color: var(--backgroundColor);
    }

    .rows {
        display: grid;
        grid-auto-rows: auto;
        gap: 20px;
    }

    .inputWrapper {
        background-color: var(--backgroundColor);
        height: 40px;
        widows: 100%;
        display: flex;
        padding: 20px 20px;
    }

    .input {
        font-family: 'Roboto Mono', monospace;
        background-color: transparent;
        border: none;

        height: 100%;

        width: 100%;
    }

    .input:focus {
        outline: none;
    }
    .btn {
        background-color: transparent;
        color: var(--black);
        font-family: 'Roboto Mono', monospace;
        border: none;
    }

    .btn:hover {
        outline: none;
        box-shadow: 0px 5px 17px 1px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }

    .itemWrapper {
        border-radius: 20px;
        border: 6px solid var(--black);
    }

    .item {
        background-color: var(--primaryColor);
        height: 80px;

        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
    }

    .deleteBtn {
        width: 15px;
        grid-column: 6/7;
        grid-row: 1/2;
        padding: 5px;
    }

    .text {
        grid-column: 2/4;
        grid-row: 1/2;
        align-self: center;
    }

    p {
        margin: 0;
    }
</style>
