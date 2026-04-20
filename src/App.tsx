import { useMemo, useState } from "react";
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

function getPriceValue(price: string) {
  return Number(price.replace("R$", "").replace(".", "").replace(",", ".").trim());
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getOrderUrl(selectedItems: Array<{ item: MenuItem; amount: number }>) {
  const lines =
    selectedItems.length > 0
      ? selectedItems.map(({ item, amount }) => `- ${amount}x ${item.name} (${item.price})`)
      : ["Gostaria de fazer uma encomenda."];
  const total = selectedItems.reduce(
    (sum, { item, amount }) => sum + getPriceValue(item.price) * amount,
    0,
  );

  const message = [
    "Olá, vim pelo cardápio digital da D'Glauci Doces e Salgados.",
    "Meu pedido:",
    ...lines,
    selectedItems.length > 0 ? `Total estimado: ${formatCurrency(total)}` : "",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

type OrderPanelProps = {
  selectedItems: Array<{ item: MenuItem; amount: number }>;
  selectedCount: number;
  selectedTotal: number;
  orderUrl: string;
  onChangeAmount: (item: MenuItem, delta: number) => void;
  onRemoveItem: (item: MenuItem) => void;
};

function OrderPanel({
  selectedItems,
  selectedCount,
  selectedTotal,
  orderUrl,
  onChangeAmount,
  onRemoveItem,
}: OrderPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col text-[#f5efe4]">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#d7b46a]">Pedido</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-[#fff7e8]">
        {selectedCount === 0
          ? "Sua seleção"
          : `${selectedCount} item${selectedCount > 1 ? "s" : ""}`}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#bdb3a0]">
        Escolha os itens e envie tudo em uma única mensagem.
      </p>
      <p className="mt-2 text-sm leading-6 text-[#d7b46a]">
        Consulte os sabores após enviar o pedido via WhatsApp.
      </p>

      <div className="mt-6 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {selectedItems.length > 0 ? (
          selectedItems.map(({ item, amount }) => (
            <div key={getItemKey(item)} className="border-b border-[#2c261c] pb-3">
              <div className="flex justify-between gap-4">
                <p className="text-sm font-semibold text-[#fff7e8]">{item.name}</p>
                <p className="text-sm font-black text-[#d7b46a]">{amount}x</p>
              </div>
              <p className="mt-1 text-xs text-[#9f9583]">
                {item.price} · {item.quantity}
              </p>
              <div className="mt-3 grid grid-cols-[34px_minmax(0,1fr)_34px_auto] items-center gap-2">
                <button
                  type="button"
                  className="h-8 rounded-lg border border-[#3b3325] bg-[#17140f] text-base font-black text-[#d7b46a]"
                  onClick={() => onChangeAmount(item, -1)}
                  aria-label={`Remover uma unidade de ${item.name}`}
                >
                  -
                </button>
                <span className="flex h-8 items-center justify-center rounded-lg bg-[#0c0b09] text-sm font-black text-[#fff7e8]">
                  {amount}
                </span>
                <button
                  type="button"
                  className="h-8 rounded-lg border border-[#d7b46a] bg-[#d7b46a] text-base font-black text-[#0b0a08]"
                  onClick={() => onChangeAmount(item, 1)}
                  aria-label={`Adicionar uma unidade de ${item.name}`}
                >
                  +
                </button>
                <button
                  type="button"
                  className="h-8 rounded-lg border border-[#3b3325] px-3 text-xs font-bold text-[#bdb3a0]"
                  onClick={() => onRemoveItem(item)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-[#3b3325] p-4 text-sm leading-6 text-[#9f9583]">
            Use os controles dos produtos para montar seu pedido.
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-[#3b3325] pt-4">
        <div className="mb-4 flex justify-between text-sm font-bold text-[#fff7e8]">
          <span>Total estimado</span>
          <span>{formatCurrency(selectedTotal)}</span>
        </div>

        <a
          href={orderUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-black transition ${
            selectedCount > 0
              ? "bg-[#d7b46a] text-[#0b0a08] hover:bg-[#f0ca79]"
              : "border border-[#4a3c29] bg-transparent text-[#d7b46a] hover:border-[#d7b46a]"
          }`}
        >
          {selectedCount > 0 ? "Enviar pelo WhatsApp" : "Chamar no WhatsApp"}
        </a>
      </div>
    </div>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category | "todos">("todos");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

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
    () =>
      menuItems
        .map((item) => ({ item, amount: selected[getItemKey(item)] ?? 0 }))
        .filter(({ amount }) => amount > 0),
    [selected],
  );

  const selectedCount = selectedItems.reduce((total, { amount }) => total + amount, 0);
  const selectedTotal = selectedItems.reduce(
    (total, { item, amount }) => total + getPriceValue(item.price) * amount,
    0,
  );
  const orderUrl = getOrderUrl(selectedItems);

  const changeAmount = (item: MenuItem, delta: number) => {
    const key = getItemKey(item);

    setSelected((current) => {
      const nextAmount = Math.max((current[key] ?? 0) + delta, 0);
      const next = { ...current };

      if (nextAmount === 0) {
        delete next[key];
      } else {
        next[key] = nextAmount;
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
                  Pedir no WhatsApp
                </a>
              </div>
            </header>

            <div className="grid gap-8 py-8 lg:grid-cols-[minmax(420px,660px)_minmax(260px,1fr)] lg:items-end lg:py-16">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#d7b46a]">
                  Encomendas artesanais
                </p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.04] text-[#fff7e8] sm:text-6xl xl:text-7xl">
                  Uma seleção para celebrar bem.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#bdb3a0] sm:mt-6">
                  Salgados fritos, assados e doces vendidos em cento. Selecione quantidades e envie
                  o pedido pelo WhatsApp.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#d7b46a] px-5 py-3 text-sm font-black text-[#0b0a08] transition hover:bg-[#f0ca79]"
                  >
                    Fazer pedido no WhatsApp
                  </a>
                  <p className="text-sm text-[#9f9583]">(43) 9 8801-2398</p>
                </div>
              </div>

              <div className="hidden gap-3 sm:grid">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                    <p className="font-serif text-3xl text-[#d7b46a]">{totals.fritos}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9f9583]">Fritos</p>
                  </div>
                  <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                    <p className="font-serif text-3xl text-[#d7b46a]">{totals.assados}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9f9583]">Assados</p>
                  </div>
                  <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                    <p className="font-serif text-3xl text-[#d7b46a]">{totals.doces}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9f9583]">Doces</p>
                  </div>
                </div>

                <div className="rounded-lg border border-[#2f281d] bg-[#11100d]/80 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm font-bold">
                    <span className="text-[#bdb3a0]">Pedido atual</span>
                    <span className="text-[#fff7e8]">
                      {selectedCount > 0 ? `${selectedCount} item${selectedCount > 1 ? "s" : ""}` : "vazio"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4 text-sm font-bold">
                    <span className="text-[#bdb3a0]">Total estimado</span>
                    <span className="text-[#d7b46a]">{formatCurrency(selectedTotal)}</span>
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
              <img
                src="/menu/p3-3.jpg"
                alt="Mini pizza"
                className="absolute inset-0 h-full w-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,6,0.05),rgba(8,8,6,0.72))]" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">
                  Destaque
                </p>
                <h2 className="mt-3 font-serif text-4xl text-[#fff7e8]">Mini Pizza</h2>
                <p className="mt-2 text-sm leading-6 text-[#d8cfbf]">Cem unidades · R$ 100,00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid w-full gap-8 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12 xl:px-16 2xl:px-20">
        <div>
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">
                {activeCategory === "todos" ? "Cardápio completo" : categoryLabels[activeCategory]}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#fff7e8]">
                {filteredItems.length} opções para encomendar
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredItems.map((item) => {
              const amount = selected[getItemKey(item)] ?? 0;

              return (
                <article
                  key={getItemKey(item)}
                  className="group overflow-hidden rounded-lg border border-[#2f281d] bg-[#11100d] shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#17140f]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex min-h-52 flex-col p-3 sm:min-h-60 sm:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d7b46a] sm:text-xs">
                          {categoryLabels[item.category]}
                        </p>
                        <h3 className="mt-2 text-base font-semibold leading-snug text-[#fff7e8] sm:text-xl">
                          {item.name}
                        </h3>
                      </div>
                      <p className="w-fit shrink-0 rounded-md border border-[#4a3c29] px-2 py-1.5 text-xs font-black text-[#d7b46a] sm:px-3 sm:py-2 sm:text-sm">
                        {item.price}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 sm:pt-5">
                      <p className="text-sm text-[#bdb3a0] sm:text-base">{item.quantity}</p>
                      {item.note ? (
                        <p className="mt-2 inline-flex rounded-md border border-[#3b3325] px-2 py-1.5 text-xs font-bold text-[#9f9583] sm:mt-3 sm:px-3 sm:py-2 sm:text-sm">
                          {item.note}
                        </p>
                      ) : null}

                      <div className="mt-3 grid grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-2 sm:mt-4 sm:grid-cols-[44px_minmax(0,1fr)_44px] sm:gap-3">
                        <button
                          type="button"
                          className="h-9 rounded-lg border border-[#3b3325] bg-[#17140f] text-lg font-black text-[#d7b46a] transition hover:border-[#d7b46a] sm:h-11 sm:text-xl"
                          onClick={() => changeAmount(item, -1)}
                          aria-label={`Remover ${item.name}`}
                        >
                          -
                        </button>
                        <span className="flex h-9 items-center justify-center rounded-lg bg-[#0c0b09] px-2 text-base font-black text-[#fff7e8] sm:h-11 sm:text-lg">
                          {amount}
                        </span>
                        <button
                          type="button"
                          className="h-9 rounded-lg border border-[#d7b46a] bg-[#d7b46a] text-lg font-black text-[#0b0a08] transition hover:bg-[#f0ca79] sm:h-11 sm:text-xl"
                          onClick={() => changeAmount(item, 1)}
                          aria-label={`Adicionar ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="hidden max-h-[calc(100vh-3rem)] self-start rounded-lg border border-[#2f281d] bg-[#11100d] p-5 shadow-[0_20px_44px_rgba(0,0,0,0.28)] lg:sticky lg:top-6 lg:block">
          <OrderPanel
            selectedItems={selectedItems}
            selectedCount={selectedCount}
            selectedTotal={selectedTotal}
            orderUrl={orderUrl}
            onChangeAmount={changeAmount}
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
              selectedCount > 0
                ? "bg-[#d7b46a] text-[#0b0a08]"
                : "border border-[#4a3c29] bg-[#11100d] text-[#d7b46a]"
            }`}
          >
            {selectedCount > 0
              ? `Enviar ${selectedCount} item${selectedCount > 1 ? "s" : ""}`
              : "WhatsApp"}
          </a>
          <button
            type="button"
            className="relative flex h-14 items-center justify-center rounded-lg border border-[#4a3c29] bg-[#11100d] text-[#d7b46a] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrinho"
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
            {selectedCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#a6202d] px-2 text-xs font-black text-white">
                {selectedCount}
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
            aria-label="Fechar carrinho"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute bottom-0 right-0 flex max-h-[86vh] w-full flex-col rounded-t-lg border-t border-[#2f281d] bg-[#11100d] p-5 shadow-[0_-18px_38px_rgba(0,0,0,0.38)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#d7b46a]">
                Carrinho
              </p>
              <button
                type="button"
                className="rounded-lg border border-[#3b3325] px-3 py-2 text-sm font-black text-[#fff7e8]"
                onClick={() => setCartOpen(false)}
              >
                Fechar
              </button>
            </div>
            <OrderPanel
              selectedItems={selectedItems}
              selectedCount={selectedCount}
              selectedTotal={selectedTotal}
              orderUrl={orderUrl}
              onChangeAmount={changeAmount}
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
