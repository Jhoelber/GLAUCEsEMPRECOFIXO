export type Category = "fritos" | "assados" | "doces";

export type MenuItem = {
  name: string;
  category: Category;
  image: string;
};

export const categoryLabels: Record<Category, string> = {
  fritos: "Salgados fritos",
  assados: "Salgados assados",
  doces: "Doces",
};

export const menuItems: MenuItem[] = [
  {
    name: "Bolinha de Queijo",
    category: "fritos",
    image: "/menu/p1-2.jpg",
  },
  {
    name: "Coxinha de Frango",
    category: "fritos",
    image: "/menu/p1-4.png",
  },
  {
    name: "Quibe",
    category: "fritos",
    image: "/menu/p1-3.jpg",
  },
  {
    name: "Risolis",
    category: "fritos",
    image: "/menu/p2-4.png",
  },
  {
    name: "Enroladinho de Salsicha",
    category: "fritos",
    image: "/menu/p2-1.jpg",
  },
  {
    name: "Croquete",
    category: "fritos",
    image: "/menu/p2-2.png",
  },
  {
    name: "Mini Espeto de Frango",
    category: "fritos",
    image: "/menu/p2-3.png",
  },
  {
    name: "Travesseiro",
    category: "fritos",
    image: "/menu/p2-4.png",
  },
  {
    name: "Esfirras",
    category: "assados",
    image: "/menu/p3-1.jpg",
  },
  {
    name: "Lanche Natural",
    category: "assados",
    image: "/menu/p3-2.jpg",
  },
  {
    name: "Mini Pizza",
    category: "assados",
    image: "/menu/p3-3.jpg",
  },
  {
    name: "Enrolado",
    category: "assados",
    image: "/menu/p3-4.jpg",
  },
  {
    name: "Empadas",
    category: "assados",
    image: "/menu/p4-1.jpg",
  },
  {
    name: "Quiches",
    category: "assados",
    image: "/menu/p4-2.jpg",
  },
  {
    name: "Brigadeiro",
    category: "doces",
    image: "/menu/p5-1.jpg",
  },
  {
    name: "Beijinho",
    category: "doces",
    image: "/menu/p5-2.jpg",
  },
  {
    name: "Casadinho",
    category: "doces",
    image: "/menu/p5-3.jpg",
  },
  {
    name: "Cajuzinho",
    category: "doces",
    image: "/menu/p5-4.jpg",
  },
];
