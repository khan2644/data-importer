import combo from "@/assets/hero-combo.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import rolls from "@/assets/dish-rolls.jpg";
import fries from "@/assets/dish-fries.jpg";
import wrap from "@/assets/dish-wrap.jpg";
import drink from "@/assets/dish-drink.jpg";
import chocoSandwich from "@/assets/dish-choco-sandwich.jpg";
import dahiVada from "@/assets/dish-dahi-vada.jpg";

export type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  mrp?: number;
  category: "Combos" | "Burgers" | "Pizza" | "Sides" | "Wraps" | "Snacks" | "Desserts" | "Drinks";
  pieces?: number;
  veg: boolean;
  rating: number;
  time: string;
  image: string;
  bestseller?: boolean;
  ingredients: string[];
  quality: string[];
  layers: [string, string, string, string];
};

export const CATEGORIES = [
  "All",
  "Combos",
  "Burgers",
  "Pizza",
  "Wraps",
  "Sides",
  "Snacks",
  "Desserts",
  "Drinks",
] as const;

export const MENU: Dish[] = [
  {
    id: "combo-149",
    name: "Delicious Combo",
    desc: "Chicken cheese stuffed patty burger + french fries + cold drink",
    price: 149,
    mrp: 219,
    category: "Combos",
    veg: false,
    rating: 4.8,
    time: "25 min",
    image: combo,
    bestseller: true,
    ingredients: ["Chicken patty", "Cheese", "Fresh salad", "Fries", "Cold drink"],
    quality: ["Cooked after ordering", "Freshly packed"],
    layers: ["Toasted bun", "Melted cheese", "Chicken patty", "Crisp salad"],
  },
  {
    id: "burger-cheese",
    name: "Chicken Cheese Stuf Patty Burger",
    desc: "Crispy chicken patty, molten cheese core, lettuce & onion rings",
    price: 119,
    mrp: 149,
    category: "Burgers",
    veg: false,
    rating: 4.9,
    time: "20 min",
    image: combo,
    bestseller: true,
    ingredients: ["Chicken patty", "Cheese centre", "Lettuce", "Onion", "Soft bun"],
    quality: ["Freshly assembled", "Made to order"],
    layers: ["Top bun", "Cheese", "Chicken patty", "Bottom bun"],
  },
  {
    id: "pizza-cheese",
    name: "Cheese Burst Pizza",
    desc: "Hand stretched base, herbed tomato sauce and a full cheese pull",
    price: 199,
    mrp: 249,
    category: "Pizza",
    veg: true,
    rating: 4.7,
    time: "30 min",
    image: pizza,
    ingredients: ["Pizza base", "Tomato sauce", "Mozzarella", "Herbs"],
    quality: ["Hand-stretched base", "Baked on order"],
    layers: ["Herbed cheese", "Mozzarella", "Tomato sauce", "Fresh base"],
  },
  {
    id: "rolls-spring",
    name: "Chicken Spring Roll",
    desc:
      "Crispy outside, delicious inside — 5 pieces fried fresh in Tirupati oil, served with sweet chilli dip. Light, crispy and made with love.",
    price: 99,
    pieces: 5,
    category: "Snacks",
    veg: false,
    rating: 4.8,
    time: "18 min",
    image: rolls,
    bestseller: true,
    ingredients: ["Chicken filling", "Fresh vegetables", "Crisp wrapper", "Sweet chilli dip"],
    quality: ["Fried fresh", "Prepared in Tirupati oil"],
    layers: ["Crisp wrapper", "Chicken", "Vegetables", "Sweet chilli dip"],
  },
  {
    id: "sandwich-chocolate",
    name: "Chocolate Sandwich",
    desc:
      "White bread loaded with cheese, chocolate chips and rich chocolate syrup — cheesy, chocolaty and absolutely irresistible. Made fresh on order.",
    price: 79,
    category: "Desserts",
    veg: true,
    rating: 4.9,
    time: "15 min",
    image: chocoSandwich,
    bestseller: true,
    ingredients: ["White bread", "Cheese", "Chocolate chips", "Chocolate syrup"],
    quality: ["Made fresh on order", "Served warm"],
    layers: ["Toasted bread", "Chocolate syrup", "Cheese", "Chocolate chips"],
  },
  {
    id: "dahi-vada",
    name: "Dahi Vada",
    desc:
      "Soft, spongy vadas in chilled creamy curd with tangy tamarind, mint chutney and masala. All inclusive — thanda, soft and full of flavours.",
    price: 60,
    category: "Snacks",
    veg: true,
    rating: 4.7,
    time: "20 min",
    image: dahiVada,
    ingredients: ["Soft vada", "Chilled curd", "Tamarind chutney", "Mint chutney", "Masala"],
    quality: ["Freshly assembled", "Served chilled"],
    layers: ["Masala", "Mint chutney", "Creamy curd", "Soft vada"],
  },
  {
    id: "fries-cheesy",
    name: "Loaded Cheesy Fries",
    desc: "Salted fries drowned in warm cheddar sauce and peri sprinkle",
    price: 89,
    category: "Sides",
    veg: true,
    rating: 4.8,
    time: "15 min",
    image: fries,
    bestseller: true,
    ingredients: ["Potato fries", "Cheddar sauce", "Peri seasoning", "Salt"],
    quality: ["Fried to order", "Sauced before serving"],
    layers: ["Peri sprinkle", "Cheddar sauce", "Crisp fries", "Fresh potato"],
  },
  {
    id: "wrap-paneer",
    name: "Paneer Tikka Wrap",
    desc: "Char-grilled paneer, mint mayo and crunchy salad in soft roti",
    price: 129,
    category: "Wraps",
    veg: true,
    rating: 4.7,
    time: "22 min",
    image: wrap,
    ingredients: ["Paneer tikka", "Mint mayo", "Fresh salad", "Soft roti"],
    quality: ["Char-grilled filling", "Rolled fresh"],
    layers: ["Soft roti", "Mint mayo", "Paneer tikka", "Crunchy salad"],
  },
  {
    id: "drink-cola",
    name: "Chilled Cola",
    desc: "Ice cold fizz, served in a 400ml sealed glass",
    price: 49,
    category: "Drinks",
    veg: true,
    rating: 4.5,
    time: "10 min",
    image: drink,
    ingredients: ["Chilled cola", "Ice", "Fresh lemon"],
    quality: ["Sealed serving", "Served ice cold"],
    layers: ["Cold fizz", "Fresh lemon", "Crystal ice", "Sealed glass"],
  },
];

export const BRAND = {
  name: "Ms Delight",
  tagline: "Crafted with love, delivered with delight",
  phone: "9737662239",
  instagram: "ms_delight20",
  freeDeliveryAbove: 299,
  radiusKm: 3,
};
