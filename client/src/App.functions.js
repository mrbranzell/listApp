import axios from 'axios';

export let items = [];

export let userLaguage = localStorage.getItem('userLaguage') ? localStorage.getItem('userLaguage') : 'swe';

export function handleLaguageChange(e) {
    localStorage.setItem('userLaguage', e.target.value);
    userLaguage = localStorage.getItem('userLaguage');
}

// 🗣🗣🗣🗣🗣 all the laguage switching stuff
export let UIlang =
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

// ➕➕➕
export const addItem = async (input) => {
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
