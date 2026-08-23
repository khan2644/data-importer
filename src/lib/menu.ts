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
};

export const CATEGORIES = [
  "All",
  "Combos",
  "Burgers",
  "Pizza",
  "Wraps",
  "Sides",
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
  },
  {
    id: "rolls-spring",
    name: "Crispy Spring Rolls",
    desc: "Six golden rolls with sweet chilli dip, fried fresh on order",
    price: 99,
    category: "Sides",
    veg: true,
    rating: 4.6,
    time: "18 min",
    image: rolls,
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
