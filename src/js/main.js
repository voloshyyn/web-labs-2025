import "./scss/main.scss";
import { Store } from "./core/store.js";
import { api } from "./api/http.js";
import { endpoints } from "./api/endpoints.js";

const store = new Store({ items: [], loading: false, error: null });

async function loadItems() {
  store.set({ loading: true });
  try {
    const res = await api.get(endpoints.items, { params: { _limit: 6 } });
    store.set({ items: res.data, loading: false, error: null });
  } catch (err) {
    store.set({ error: err.message, loading: false });
  }
}

function render() {
  const root = document.getElementById("app");
  const { items, loading, error } = store.get();
  root.innerHTML = "";
  const section = document.createElement("section");
  section.className = "home";
  const h1 = document.createElement("h1");
  h1.className = "home__title";
  h1.textContent = "Starter List";
  section.appendChild(h1);

  if (loading) {
    section.append("Loading...");
  } else if (error) {
    section.append("Error: " + error);
  } else {
    const grid = document.createElement("div");
    grid.className = "home__grid";
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<h3>${item.title}</h3><p>Category: ${item.category}</p><p>Price: ${item.price}</p>`;
      grid.appendChild(card);
    });
    section.appendChild(grid);
  }

  root.appendChild(section);
}

store.subscribe(render);
render();
loadItems();
