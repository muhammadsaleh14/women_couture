import type { Product } from "@/shared/model/types";

const img = (seed: number) => `https://picsum.photos/seed/wc${seed}/800/1000`;

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Embroidered Lawn 3PC",
    description:
      "Lawn shirt with schiffli embroidery, printed dupatta, dyed trouser.",
    mainCategory: "Unstitched",
    subCategory: "3 PC",
    categoryId: "three-piece",
    regularPrice: 12999,
    salePrice: 9999,
    isNew: true,
    images: [img(1), img(101), img(102)],
    variants: [
      {
        id: "p1-navy",
        colorName: "Navy Blue",
        hex: "#1e3a5f",
        stock: 4,
        imageUrl: img(1),
      },
      {
        id: "p1-blush",
        colorName: "Blush",
        hex: "#e8c4c4",
        stock: 0,
        imageUrl: img(2),
      },
    ],
  },
  {
    id: "p2",
    name: "Chiffon Dupatta Set",
    description: "Cotton satin shirt, chiffon dupatta with sequin border.",
    mainCategory: "Unstitched",
    subCategory: "3 PC",
    categoryId: "three-piece",
    regularPrice: 14999,
    isNew: true,
    images: [img(3), img(103)],
    variants: [
      {
        id: "p2-olive",
        colorName: "Olive",
        hex: "#6b7c59",
        stock: 6,
        imageUrl: img(3),
      },
      {
        id: "p2-maroon",
        colorName: "Maroon",
        hex: "#722f37",
        stock: 2,
        imageUrl: img(4),
      },
    ],
  },
  {
    id: "p3",
    name: "Printed 2PC Kurta",
    description: "Lawn kurta with trouser; light summer weight.",
    mainCategory: "Unstitched",
    subCategory: "2 PC",
    categoryId: "two-piece",
    regularPrice: 6999,
    salePrice: 5499,
    isNew: false,
    images: [img(5), img(105)],
    variants: [
      {
        id: "p3-teal",
        colorName: "Teal",
        hex: "#2d6a6a",
        stock: 8,
        imageUrl: img(5),
      },
    ],
  },
  {
    id: "p4",
    name: "Floral 2PC",
    description: "Digital print lawn, straight trouser.",
    mainCategory: "Unstitched",
    subCategory: "2 PC",
    categoryId: "two-piece",
    regularPrice: 7999,
    isNew: true,
    images: [img(6)],
    variants: [
      {
        id: "p4-ivory",
        colorName: "Ivory",
        hex: "#f5f0e8",
        stock: 3,
        imageUrl: img(6),
      },
      {
        id: "p4-black",
        colorName: "Black",
        hex: "#1a1a1a",
        stock: 0,
        imageUrl: img(7),
      },
    ],
  },
  {
    id: "p5",
    name: "Embroidered Dupatta Separate",
    description: "Chiffon dupatta with tilla work — pairs with solids.",
    mainCategory: "Unstitched",
    subCategory: "Separates",
    categoryId: "separates",
    regularPrice: 3999,
    isNew: false,
    images: [img(8)],
    variants: [
      {
        id: "p5-gold",
        colorName: "Gold",
        hex: "#c9a227",
        stock: 12,
        imageUrl: img(8),
      },
    ],
  },
  {
    id: "p6",
    name: "Cotton Trouser Separate",
    description: "Dyed cotton trouser with embroidered hem.",
    mainCategory: "Unstitched",
    subCategory: "Separates",
    categoryId: "separates",
    regularPrice: 2499,
    isNew: true,
    images: [img(9)],
    variants: [
      {
        id: "p6-white",
        colorName: "White",
        hex: "#fafafa",
        stock: 20,
        imageUrl: img(9),
      },
    ],
  },
  {
    id: "p7",
    name: "Luxury Lawn 3PC",
    description: "Fully embroidered front, organza dupatta, cambric trouser.",
    mainCategory: "Unstitched",
    subCategory: "3 PC",
    categoryId: "three-piece",
    regularPrice: 18999,
    salePrice: 15999,
    isNew: true,
    images: [img(10), img(11), img(12)],
    variants: [
      {
        id: "p7-sage",
        colorName: "Sage",
        hex: "#9caf88",
        stock: 1,
        imageUrl: img(10),
      },
    ],
  },
  {
    id: "p8",
    name: "Summer 2PC Co-ord",
    description: "Breathable lawn top and dupatta only.",
    mainCategory: "Unstitched",
    subCategory: "2 PC",
    categoryId: "two-piece",
    regularPrice: 5999,
    isNew: false,
    images: [img(13)],
    variants: [
      {
        id: "p8-coral",
        colorName: "Coral",
        hex: "#e07a7a",
        stock: 5,
        imageUrl: img(13),
      },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string) {
  return mockProducts.filter((p) => p.categoryId === categoryId);
}
