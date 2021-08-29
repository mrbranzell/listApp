<!-- This app does too much for me to explain righ now.. but i will, i will -->
<script>
  import axios from 'axios'
  import { onMount } from 'svelte'

  // 🗣🗣🗣🗣🗣 all the laguage switching stuff
  let UIlangs = [
    {
      id: 0,
      lang: { source: 'Svenska', target: 'Português', abbreviated: `sv-pt` },
      lista: { source: 'Lista', target: 'Lista' },
      tranTraned: { source: 'Översätt', target: 'Traduzir' },
    },
    {
      id: 1,
      lang: { source: 'Português', target: 'Svenska', abbreviated: `pt-sv` },
      lista: { source: 'Lista', target: 'Lista' },
      tranTraned: { source: 'Traduzir', target: 'Översätt' },
    },
  ]

  // TODO set List by initial user... also rename this variable :)
  const List = 0

  // stuff for the database. which is laguageA and B is sett by initial user.
  let langA
  let langB
  let input
  // just looks to see if any option is saved on the devise

  let UILangID = sessionStorage.getItem('languagePicked') || 0
  let setUILangID
  console.log(UILangID)
  // source laguage, target laguage or both
  let languageOption

  $: UIlang = UIlangs[0]
  $: languagesToSee = [
    {
      id: 0,
      option: `${UIlang.lang.source} & ${UIlang.lang.target}`,
    },
    { id: 1, option: `${UIlang.lang.source}` },
    { id: 2, option: `${UIlang.lang.target}` },
  ]

  let items = []
  $: disabled = !input
  let removed = false

  // FUNCTIONS

  onMount(async () => {
    const { data } = await axios.get('/api/items')
    items = data
  })
  // ➕➕➕
  const addItem = async () => {
    const translationConf = {
      value: input,
      fromTo: UIlang.lang.abbreviated,
    }
    const translated = await axios.post('/api/translation', translationConf)

    //right now List set to 0(swedish to portugese)
    if (UIlang === List) {
      langA = input
      langB = translated.data
    } else {
      langA = translated.data
      langB = input
    }

    const item = {
      date: new Date().getTime(),
      bought: false,
      lang1: langA,
      fromTo: UIlang.lang.abbreviated,
      lang2: langB,
    }
    console.log(item)
    const response = await axios.post('/api/items', item)
    items = [response.data, ...items]
    input = ''
  }
  // 🛒🛒🛒🛒🛒🛒
  const boughtItem = async (id, bought) => {
    const response = await axios.patch('/api/items/' + id, { bought: !bought })

    if (response.data.id === id) {
      console.log(JSON.stringify(response.data))
      let item = items.find((d) => d._id === id)
      item.bought = !bought
      items.find((d) => d._id === id).bought = item.bought
      // needed to update the dom https://svelte.dev/tutorial/updating-arrays-and-objects
      items = items
    }
  }
  // ❌❌❌❌❌
  async function removeItem(id) {
    const response = await axios.delete('/api/items/' + id)
    if (response.data.id === id) {
      items = items.filter((t) => t._id !== id)
    }
  }

  function handleSubmit() {
    UILangSelectId = languageOption
    UILangID = setUILangID
    console.log(setUILangID)
    sessionStorage.setItem('languagePicked', UILangID)
  }
</script>

<section>
  <div class="app">
    {UILangID}

    <h1>
      {UIlang.lista.source}/{UIlang.lista.target}
    </h1>

    <div>
      <p>
        {UIlang.tranTraned.source} => {UIlang.tranTraned.target}
      </p>
      <form on:change|preventDefault={handleSubmit}>
        <select bind:value={setUILangID}>
          {#each UIlangs as UILang (UILang.id + 'i am a key')}
            <option value={UILang.id}
              >{UILang.id + ' '}{UILang.lang.source} ⇛ {UILang.lang
                .target}</option
            >
          {/each}
        </select>
        <select bind:value={languageOption}>
          {#each languagesToSee as languageToSee (languageToSee)}
            <option value={languageToSee.id}>{languageToSee.option}</option>
          {/each}
        </select>
        <button type="submit"> 💾 </button>
      </form>
    </div>

    <input class="input" type="text" placeholder="Item" bind:value={input} />
    <button class="btn" on:click={addItem} {disabled}>save</button>

    {#each items as item (item._id)}
      <div class="item">
        <button
          class="btn {item.bought ? 'lineThrough' : ''}"
          on:click={() => boughtItem(item._id, item.bought)}
        >
          <p>{List ? item.lang1 : item.lang2}</p>
          <p>{List ? item.lang2 : item.lang1}</p>
        </button>
        <button>translate</button>
        <button class="btn" on:click={() => removeItem(item._id)}>delete</button
        >
      </div>
    {/each}
  </div>
</section>

<style>
  .lineThrough {
    text-decoration: line-through;
  }
  .app {
    width: 300px;
  }
  section {
    display: flex;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #ffe5b4;
  }
</style>
