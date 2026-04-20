import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { categoryLabels, menuItems, type Category, type MenuItem } from "./menu";

const categories: Array<Category | "todos"> = ["todos", "fritos", "assados", "doces"];

const categoryCopy: Record<Category | "todos", string> = {
  todos: "Todos",
  fritos: "Fritos",
  assados: "Assados",
  doces: "Doces",
};

const whatsappNumber = "5543988012398";

function getItemKey(item: MenuItem) {
  return `${item.category}-${item.name}`;
}

function getOrderUrl(selectedItems: MenuItem[]) {
  const lines =
    selectedItems.length > 0
      ? selectedItems.map((item) => `- ${item.name} (${item.price} o cento)`)
      : ["Gostaria de conhecer as opções do cardápio."];

  const message = [
    "Olá, vim pelo cardápio digital da D'Glauci Doces e Salgados.",
    "Tenho interesse nos seguintes itens:",
    ...lines,
    "Gostaria de consultar quantidades personalizadas, sabores disponíveis e valores finais.",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

type InterestPanelProps = {
  selectedItems: MenuItem[];
  orderUrl: string;
  onRemoveItem: (item: MenuItem) => void;
};

function InterestPanel({ selectedItems, orderUrl, onRemoveItem }: InterestPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col text-[#f5efe4]">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#d7b46a]">Interesse</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-[#fff7e8]">
        {selectedItems.length === 0
          ? "Sua seleção"
          : `${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}`}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#bdb3a0]">
        Selecione os itens que chamaram atenção. O preço exibido é referência para cem unidades;
        quantidades personalizadas, sabores disponíveis e valores finais serão apresentados no
        WhatsApp.
      </p>

      <div className="cart-scroll mt-6 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-2">
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <div key={getItemKey(item)} className="border-b border-[#2c261c] pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#fff7e8]">{item.name}</p>
                  <p className="mt-1 text-xs text-[#9f9583]">{categoryLabels[item.category]}</p>
                  <p className="mt-1 text-xs font-bold text-[#d7b46a]">{item.price} o cento</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-[#3b3325] px-3 py-2 text-xs font-bold text-[#bdb3a0] transition hover:border-[#d7b46a] hover:text-[#d7b46a]"
                  onClick={() => onRemoveItem(item)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-[#3b3325] p-4 text-sm leading-6 text-[#9f9583]">
            Toque em “Tenho interesse” nos produtos para montar sua lista.
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-[#3b3325] pt-4">
        <a
          href={orderUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-black transition ${
            selectedItems.length > 0
              ? "bg-[#d7b46a] text-[#0b0a08] hover:bg-[#f0ca79]"
              : "border border-[#4a3c29] bg-transparent text-[#d7b46a] hover:border-[#d7b46a]"
          }`}
        >
          {selectedItems.length > 0 ? "Consultar pelo WhatsApp" : "Chamar no WhatsApp"}
        </a>
      </div>
    </div>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category | "todos">("todos");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filteredItems = useMemo(() => {
    if (activeCategory === "todos") {
      return menuItems;
    }

    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const totals = useMemo(
    () =>
      menuItems.reduce(
        (acc, item) => {
          acc[item.category] += 1;
          return acc;
        },
        { fritos: 0, assados: 0, doces: 0 } as Record<Category, number>,
      ),
    [],
  );

  const selectedItems = useMemo(
    () => menuItems.filter((item) => selected[getItemKey(item)]),
    [selected],
  );

  const orderUrl = getOrderUrl(selectedItems);
  const featuredItem = menuItems[featuredIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % menuItems.length);
    }, 3800);

    return () => window.clearInterval(interval);
  }, []);

  const toggleItem = (item: MenuItem) => {
    const key = getItemKey(item);

    setSelected((current) => {
      const next = { ...current };

      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }

      return next;
    });
  };

  const removeItem = (item: MenuItem) => {
    const key = getItemKey(item);

    setSelected((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  return (
    <>
      <main className="min-h-screen bg-[#080806] pb-28 text-[#f5efe4] lg:pb-0">
        <section className="relative overflow-hidden border-b border-[#2a241a] bg-[#080806]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(215,180,106,0.18),transparent_34%),linear-gradient(90deg,rgba(8,8,6,1)_0%,rgba(8,8,6,0.94)_48%,rgba(8,8,6,0.68)_100%)]" />
          <div className="relative grid w-full gap-8 px-5 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-12 xl:px-16 2xl:px-20">
            <div>
              <header className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/logo-dglauci.svg"
                    alt="D'Glauci Doces e Salgados"
                    className="h-16 w-16 rounded-lg object-cover shadow-[0_12px_34px_rgba(245,130,11,0.22)] sm:h-20 sm:w-20"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d7b46a] sm:text-sm">
                      D'Glauci
                    </p>
                    <p className="mt-1 text-sm text-[#bdb3a0]">Doces e Salgados</p>
                  </div>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-[#4a3c29] px-4 py-3 text-sm font-bold text-[#f5efe4] transition hover:border-[#d7b46a] hover:text-[#d7b46a]"
                  >
                    (43) 9 8801-2398
                  </a>
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#d7b46a] px-4 py-3 text-sm font-black text-[#0b0a08] transition hover:bg-[#f0ca79]"
                  >
                    Consultar no WhatsApp
                  </a>
                </div>
              </header>

              <div className="grid gap-8 py-8 lg:grid-cols-[minmax(420px,660px)_minmax(260px,1fr)] lg:items-end lg:py-16">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#d7b46a]">
                    Encomendas artesanais
                  </p>
                  <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.04] text-[#fff7e8] sm:text-6xl xl:text-7xl">
                    Escolha o que deseja consultar.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#bdb3a0] sm:mt-6">
                    Selecione os produtos de interesse. O preço do cento aparece como referência;
                    quantidades personalizadas, sabores disponíveis e valores finais serão
                    apresentados no WhatsApp.
                  </p>
                </div>

                <div className="hidden gap-3 sm:grid">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                      <p className="font-serif text-3xl text-[#d7b46a]">{totals.fritos}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9f9583]">
                        Fritos
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                      <p className="font-serif text-3xl text-[#d7b46a]">{totals.assados}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9f9583]">
                        Assados
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                      <p className="font-serif text-3xl text-[#d7b46a]">{totals.doces}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9f9583]">
                        Doces
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7b46a]">
                      Como funciona
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#bdb3a0]">
                      Marque os itens desejados. Quantidade, sabores disponíveis e valores finais
                      são apresentados no WhatsApp.
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-4 text-sm font-bold">
                      <span className="text-[#bdb3a0]">Itens selecionados</span>
                      <span className="text-[#d7b46a]">{selectedItems.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="flex flex-wrap gap-3 pb-4" aria-label="Categorias do cardápio">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`rounded-lg border px-4 py-3 text-sm font-bold transition ${
                      activeCategory === category
                        ? "border-[#d7b46a] bg-[#d7b46a] text-[#0b0a08]"
                        : "border-[#3b3325] bg-[#11100d] text-[#f5efe4] hover:border-[#d7b46a]"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {categoryCopy[category]}
                  </button>
                ))}
              </nav>
            </div>

            <div className="hidden min-h-full lg:block">
              <div className="relative h-full min-h-[520px] overflow-hidden rounded-lg border border-[#2f281d] bg-[#11100d]">
                {menuItems.map((item, index) => (
                  <img
                    key={getItemKey(item)}
                    src={item.image}
                    alt={item.name}
                    className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                      index === featuredIndex ? "opacity-85 scale-100" : "opacity-0 scale-[1.03]"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,6,0.05),rgba(8,8,6,0.72))]" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">
                    Destaque
                  </p>
                  <h2 className="mt-3 font-serif text-4xl text-[#fff7e8]">{featuredItem.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#d8cfbf]">
                    {featuredItem.price} o cento · opções personalizadas no WhatsApp
                  </p>
                  <div className="mt-5 flex gap-2">
                    {menuItems.map((item, index) => (
                      <button
                        key={`featured-${getItemKey(item)}`}
                        type="button"
                        className={`h-1.5 rounded-full transition ${
                          index === featuredIndex ? "w-8 bg-[#d7b46a]" : "w-3 bg-[#fff7e8]/35"
                        }`}
                        onClick={() => setFeaturedIndex(index)}
                        aria-label={`Mostrar ${item.name} no destaque`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full gap-8 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12 xl:px-16 2xl:px-20">
          <div>
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">
                {activeCategory === "todos" ? "Cardápio completo" : categoryLabels[activeCategory]}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#fff7e8]">
                {filteredItems.length} opções para consultar
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredItems.map((item) => {
                const isSelected = Boolean(selected[getItemKey(item)]);

                return (
                  <article
                    key={getItemKey(item)}
                    className={`group overflow-hidden rounded-lg border bg-[#11100d] shadow-[0_18px_36px_rgba(0,0,0,0.22)] transition ${
                      isSelected ? "border-[#d7b46a]" : "border-[#2f281d]"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#17140f]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                        loading="lazy"
                      />
                    </div>
                    <div className="grid min-h-52 grid-rows-[auto_1fr_auto] p-3 sm:min-h-56 sm:p-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d7b46a] sm:text-xs">
                          {categoryLabels[item.category]}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-[#fff7e8] sm:text-xl">
                          {item.name}
                        </h3>
                      </div>

                      <p className="pt-4 text-sm leading-6 text-[#bdb3a0]">
                        <span className="font-bold text-[#d7b46a]">{item.price} o cento.</span>{" "}
                        Quantidades personalizadas e sabores disponíveis são apresentados no
                        WhatsApp.
                      </p>

                      <button
                        type="button"
                        className={`mt-4 rounded-lg px-3 py-3 text-sm font-black transition ${
                          isSelected
                            ? "border border-[#4a3c29] bg-[#0c0b09] text-[#d7b46a]"
                            : "bg-[#d7b46a] text-[#0b0a08] hover:bg-[#f0ca79]"
                        }`}
                        onClick={() => toggleItem(item)}
                      >
                        {isSelected ? "Selecionado" : "Tenho interesse"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="hidden h-[calc(100vh-3rem)] max-h-[760px] min-h-[520px] self-start rounded-lg border border-[#2f281d] bg-[#11100d] p-5 shadow-[0_20px_44px_rgba(0,0,0,0.28)] lg:sticky lg:top-6 lg:block">
            <InterestPanel
              selectedItems={selectedItems}
              orderUrl={orderUrl}
              onRemoveItem={removeItem}
            />
          </aside>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#2f281d] bg-[#080806]/95 p-3 backdrop-blur lg:hidden">
          <div className="grid grid-cols-[1fr_58px] gap-3">
            <a
              href={orderUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex h-14 items-center justify-center rounded-lg px-4 text-sm font-black shadow-[0_12px_30px_rgba(0,0,0,0.28)] ${
                selectedItems.length > 0
                  ? "bg-[#d7b46a] text-[#0b0a08]"
                  : "border border-[#4a3c29] bg-[#11100d] text-[#d7b46a]"
              }`}
            >
              {selectedItems.length > 0
                ? `Consultar ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}`
                : "WhatsApp"}
            </a>
            <button
              type="button"
              className="relative flex h-14 items-center justify-center rounded-lg border border-[#4a3c29] bg-[#11100d] text-[#d7b46a] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir seleção"
            >
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 6h2l1.3 8.2a2 2 0 0 0 2 1.8h5.9a2 2 0 0 0 1.9-1.4L20 9H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 20h.01M17 20h.01"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              {selectedItems.length > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#a6202d] px-2 text-xs font-black text-white">
                  {selectedItems.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {cartOpen ? (
          <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.72)] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-default"
              aria-label="Fechar seleção"
              onClick={() => setCartOpen(false)}
            />
            <div className="absolute bottom-0 right-0 flex max-h-[86vh] w-full flex-col rounded-t-lg border-t border-[#2f281d] bg-[#11100d] p-5 shadow-[0_-18px_38px_rgba(0,0,0,0.38)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#d7b46a]">
                  Seleção
                </p>
                <button
                  type="button"
                  className="rounded-lg border border-[#3b3325] px-3 py-2 text-sm font-black text-[#fff7e8]"
                  onClick={() => setCartOpen(false)}
                >
                  Fechar
                </button>
              </div>
              <InterestPanel
                selectedItems={selectedItems}
                orderUrl={orderUrl}
                onRemoveItem={removeItem}
              />
            </div>
          </div>
        ) : null}
      </main>
      <Analytics />
    </>
  );
}

export default App;
