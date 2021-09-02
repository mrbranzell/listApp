<!-- This app does too much for me to explain righ now.. but i will, i will -->
<script>
    import axios from 'axios';
    import { onMount } from 'svelte';

    let userLaguage = localStorage.getItem('userLaguage') ? localStorage.getItem('userLaguage') : 'swe';

    function handleLaguageChange(e) {
        localStorage.setItem('userLaguage', e.target.value);
        userLaguage = e.target.value;
        openSettings = !openSettings;
    }

    $: console.log(userLaguage);

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
        response.data && console.log(response.data);
        if (response.data.id === id) {
            items = items.filter((t) => t._id !== id);
        }
        if (response.data.id === 'all') {
            items = [];
        }
    }
</script>

<div on:click={() => (openSettings = !openSettings)} class={!openSettings && 'fullBackground'} />
<div class="app">
    <aside class={`${openSettings && 'goneSettings'}  settings`}>
        <div class="language-selector">
            <select on:blur={handleLaguageChange} value={userLaguage}>
                <option value="swe">Svenska ⇾ Português</option>
                <option value="por">Português ⇾ Svenska</option>
            </select>
        </div>
    </aside>

    <section class="card">
        <nav class="nav">
            <h3 class="h3">{UIlang.lang.abbreviated}</h3>
            <div class="settingIcon" on:click={() => (openSettings = !openSettings)}>
                <svg viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1 19.5C8.56525 16.3659 10.2081 13.3895 5.5 4.5L8 2C15.3129 10.7777 17.0253 10.2184 16.5 1H21C21.8047 9.41305 24.0022 8.82963 29.5 3L32 6C26.1018 13.6523 30.0564 13.4764 39 12V15C31.1675 19.6244 28.9541 22.6604 32 29.5L29.5 32C24.1393 27.5936 22.2471 27.9448 22 36.5H18C17.2628 28.712 16.015 26.1912 8 34.5L4.5 32C10.5562 24.7894 10.7811 22.4477 2 23L1 19.5ZM19 26C23.4183 26 27 22.6421 27 18.5C27 14.3579 23.4183 11 19 11C14.5817 11 11 14.3579 11 18.5C11 22.6421 14.5817 26 19 26Z"
                        fill="black"
                    />
                    <path
                        d="M5.5 4.5L5.14645 4.14645L4.88528 4.40762L5.05814 4.73402L5.5 4.5ZM1 19.5L0.808633 19.0381L0.396763 19.2087L0.519238 19.6374L1 19.5ZM8 2L8.38415 1.67996L8.03365 1.25924L7.64645 1.64645L8 2ZM16.5 1V0.5H15.9707L16.0008 1.02845L16.5 1ZM21 1L21.4977 0.95239L21.4545 0.5H21V1ZM29.5 3L29.8841 2.67991L29.5231 2.24672L29.1362 2.65695L29.5 3ZM32 6L32.396 6.30524L32.6407 5.9878L32.3841 5.67991L32 6ZM39 12H39.5V11.4107L38.9186 11.5067L39 12ZM39 15L39.2542 15.4306L39.5 15.2854V15H39ZM32 29.5L32.3536 29.8536L32.5966 29.6105L32.4568 29.2966L32 29.5ZM29.5 32L29.1825 32.3863L29.5329 32.6742L29.8536 32.3536L29.5 32ZM22 36.5V37H22.4858L22.4998 36.5144L22 36.5ZM18 36.5L17.5022 36.5471L17.5451 37H18V36.5ZM8 34.5L7.70938 34.9069L8.06039 35.1576L8.35986 34.8471L8 34.5ZM4.5 32L4.11713 31.6784L3.76932 32.0925L4.20938 32.4069L4.5 32ZM2 23L1.51924 23.1374L1.62978 23.5243L2.03139 23.499L2 23ZM5.05814 4.73402C7.41334 9.18095 8.07165 11.9707 7.37937 13.9966C6.69092 16.0113 4.59761 17.4684 0.808633 19.0381L1.19137 19.9619C4.96765 18.3975 7.47839 16.7994 8.32565 14.32C9.16908 11.8518 8.29476 8.70859 5.94186 4.26598L5.05814 4.73402ZM7.64645 1.64645L5.14645 4.14645L5.85355 4.85355L8.35355 2.35355L7.64645 1.64645ZM16.0008 1.02845C16.1319 3.32907 16.1198 5.0449 15.9286 6.19782C15.8328 6.77567 15.6982 7.17016 15.5444 7.41889C15.3999 7.65246 15.257 7.73242 15.1138 7.75427C14.9442 7.78017 14.6766 7.73892 14.2729 7.52831C13.8747 7.3206 13.3928 6.9736 12.8172 6.46766C11.6668 5.45642 10.2089 3.87017 8.38415 1.67996L7.61585 2.32004C9.44758 4.5187 10.946 6.15418 12.157 7.21873C12.7621 7.75068 13.3122 8.15509 13.8104 8.41494C14.303 8.6719 14.7961 8.81438 15.2648 8.74282C15.76 8.66721 16.1328 8.36852 16.3948 7.9449C16.6475 7.53644 16.81 6.99519 16.9151 6.36142C17.1258 5.0911 17.1307 3.28012 16.9992 0.971553L16.0008 1.02845ZM21 0.5H16.5V1.5H21V0.5ZM29.1362 2.65695C27.7653 4.1107 26.6214 5.21389 25.6659 5.92981C24.686 6.664 24.0131 6.90589 23.5557 6.84533C23.1609 6.79304 22.7423 6.47798 22.3602 5.49966C21.9814 4.5295 21.6979 3.04553 21.4977 0.95239L20.5023 1.04761C20.7044 3.16099 20.9975 4.75899 21.4288 5.86343C21.8569 6.95971 22.4822 7.7119 23.4245 7.83668C24.3043 7.95319 25.262 7.48198 26.2655 6.73011C27.2934 5.95996 28.4859 4.80412 29.8638 3.34305L29.1362 2.65695ZM32.3841 5.67991L29.8841 2.67991L29.1159 3.32009L31.6159 6.32009L32.3841 5.67991ZM38.9186 11.5067C36.6815 11.876 34.7792 12.1599 33.2698 12.2626C32.5158 12.3139 31.8737 12.3189 31.3456 12.2702C30.8126 12.221 30.4286 12.1198 30.169 11.9818C29.9239 11.8515 29.8001 11.6956 29.7437 11.5073C29.6818 11.3004 29.6819 10.9876 29.8256 10.5205C30.1161 9.57646 30.9252 8.21347 32.396 6.30524L31.604 5.69476C30.1257 7.6127 29.2173 9.09733 28.8699 10.2264C28.6946 10.7959 28.6457 11.326 28.7857 11.7939C28.9312 12.2802 29.2601 12.6311 29.6996 12.8648C30.1247 13.0908 30.6573 13.2109 31.2537 13.266C31.8551 13.3214 32.5554 13.3135 33.3377 13.2603C34.9008 13.1539 36.8467 12.8622 39.0814 12.4933L38.9186 11.5067ZM39.5 15V12H38.5V15H39.5ZM32.4568 29.2966C30.9604 25.9364 30.8155 23.6461 31.8632 21.6519C32.9413 19.5999 35.3315 17.7466 39.2542 15.4306L38.7458 14.5694C34.836 16.8778 32.2032 18.8547 30.978 21.1867C29.7224 23.5765 29.9937 26.224 31.5432 29.7034L32.4568 29.2966ZM29.8536 32.3536L32.3536 29.8536L31.6464 29.1464L29.1464 31.6464L29.8536 32.3536ZM22.4998 36.5144C22.5613 34.3857 22.7248 32.8037 23.007 31.6909C23.2942 30.5578 23.6738 30.0341 24.0619 29.8336C24.4345 29.6412 24.9921 29.6593 25.8833 30.0911C26.7625 30.517 27.8481 31.2894 29.1825 32.3863L29.8175 31.6137C28.4716 30.5074 27.3104 29.6713 26.3194 29.1911C25.3404 28.7168 24.4044 28.5312 23.603 28.9452C22.8171 29.3511 22.3422 30.2439 22.0376 31.4451C21.728 32.6665 21.5623 34.3367 21.5002 36.4856L22.4998 36.5144ZM18 37H22V36H18V37ZM8.35986 34.8471C10.3567 32.777 11.9054 31.4105 13.1113 30.6321C14.3408 29.8386 15.0807 29.742 15.5427 29.9276C16.0135 30.1168 16.4332 30.6907 16.7731 31.8718C17.1049 33.0244 17.318 34.6008 17.5022 36.5471L18.4978 36.4529C18.3134 34.5052 18.0941 32.846 17.7341 31.5952C17.3823 30.3729 16.8509 29.3757 15.9156 28.9998C14.9717 28.6204 13.8507 28.9647 12.569 29.7919C11.2637 30.6344 9.65076 32.0685 7.64014 34.1529L8.35986 34.8471ZM4.20938 32.4069L7.70938 34.9069L8.29062 34.0931L4.79062 31.5931L4.20938 32.4069ZM2.03139 23.499C4.2181 23.3615 5.79044 23.409 6.83594 23.6468C7.88666 23.8858 8.24026 24.2709 8.32377 24.6872C8.42537 25.1937 8.20277 25.9973 7.47053 27.2167C6.75626 28.4062 5.62788 29.8797 4.11713 31.6784L4.88287 32.3216C6.40023 30.515 7.57104 28.9918 8.32784 27.7315C9.06668 26.5011 9.48702 25.4018 9.30424 24.4906C9.10337 23.4892 8.24524 22.9418 7.05771 22.6717C5.86493 22.4004 4.17247 22.3624 1.96861 22.501L2.03139 23.499ZM0.519238 19.6374L1.51924 23.1374L2.48076 22.8626L1.48076 19.3626L0.519238 19.6374ZM26.5 18.5C26.5 22.3361 23.173 25.5 19 25.5V26.5C23.6635 26.5 27.5 22.9482 27.5 18.5H26.5ZM19 11.5C23.173 11.5 26.5 14.6639 26.5 18.5H27.5C27.5 14.0518 23.6635 10.5 19 10.5V11.5ZM11.5 18.5C11.5 14.6639 14.827 11.5 19 11.5V10.5C14.3365 10.5 10.5 14.0518 10.5 18.5H11.5ZM19 25.5C14.827 25.5 11.5 22.3361 11.5 18.5H10.5C10.5 22.9482 14.3365 26.5 19 26.5V25.5Z"
                        fill="black"
                    />
                </svg>
            </div>
        </nav>
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
                    <div class="deleteBtn" on:click={() => removeItem(item._id)}>
                        <svg viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line
                                y1="-2"
                                x2="25.0709"
                                y2="-2"
                                transform="matrix(-0.598304 0.801269 -0.69219 -0.721716 15 2.20807)"
                                stroke="black"
                                stroke-width="4"
                            />
                            <line
                                y1="-2"
                                x2="24.1344"
                                y2="-2"
                                transform="matrix(0.62152 0.783398 -0.67006 0.742307 0 3.38974)"
                                stroke="black"
                                stroke-width="4"
                            />
                        </svg>
                    </div>
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
    <div class="newList" on:click={() => removeItem('all')}>NEW LIST</div>
</div>

<style>
    .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 0 10px;
    }
    .h3 {
        color: var(--backgroundColor);
    }
    .app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .goneSettings {
        display: none;
    }

    .settingIcon {
        left: 100%;
        width: 30px;
        cursor: pointer;
    }
    .settingIcon:active {
        transform: scale(0.98);
    }
    .settings {
        background-color: var(--primaryColor);
        border-radius: 40px 40px 60px 20px;
        border: 6px solid var(--black);
        padding: 20px;
        position: fixed;
        z-index: 10;
        padding: 40px;
    }
    .fullBackground {
        z-index: 5;
        position: fixed;
        width: 100vw;
        height: 100vh;
        backdrop-filter: grayscale(1);
    }
    .title {
        text-align: center;
        margin-top: 0;
    }
    .card {
        background-color: var(--secondaryColor);
        width: 500px;
        height: fit-content;
        margin-top: 50px;

        border-radius: 40px 40px 60px 20px;
        border: 6px solid var(--black);
        box-shadow: 35px 35px 0px 4px var(--primaryColor), 35px 35px 0px 10px var(--black),
            35px 40px 10px 10px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 600px) {
        .card {
            width: 70vw;
            box-shadow: 15px 15px 0px 4px var(--primaryColor);
        }
    }
    @media (max-width: 400px) {
        .card {
            width: 87vw;
            box-shadow: 5px 5px 0px 4px var(--primaryColor);
        }
    }

    .lineThrough {
        text-decoration: line-through;
    }

    .rows {
        padding: 0 50px 50px 50px;
        display: grid;
        grid-auto-rows: auto;
        gap: 15px;
    }
    @media (max-width: 400px) {
        .rows {
            padding: 0 30px 30px 30px;
        }
    }

    .inputWrapper {
        background-color: var(--backgroundColor);
        height: 20px;
        widows: 100%;
        display: flex;
        padding: 10px 20px;
    }

    .input {
        font-family: 'Roboto Mono', monospace;
        background-color: transparent;
        border: none;

        height: 100%;
        min-height: 20px;
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
        height: 20px;
        cursor: pointer;
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
        height: 50px;

        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
        cursor: pointer;
    }

    .deleteBtn {
        width: 15px;
        grid-column: 6/7;
        grid-row: 1/2;
        padding: 5px;
        cursor: pointer;
    }

    .text {
        grid-column: 2/7;
        grid-row: 1/2;
        align-self: center;
    }

    .newList {
        position: fixed;
        bottom: 0;
        right: 0;
        background-color: var(--primaryColor);
        width: fit-content;
        padding: 8px;
        margin: 10px;
        border-radius: 20px;
        border: 6px solid var(--black);
        box-shadow: 0px 5px 17px 1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .newList:active {
        transform: scale(0.98);
    }

    p {
        margin: 0;
    }
</style>
