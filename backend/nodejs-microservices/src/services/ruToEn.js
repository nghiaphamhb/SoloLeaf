// Token-level mapping RU -> EN
const RU2EN = {
    "бургер": "burger",
    "гамбургер": "hamburger",
    "чизбургер": "cheeseburger",

    "курица": "chicken",
    "куриный": "chicken",
    "куриные": "chicken",

    "острый": "spicy",
    "острая": "spicy",
    "острое": "spicy",
    "острые": "spicy",
    "остро": "spicy",

    "картошка": "fries",
    "фри": "fries",

    "пицца": "pizza",
    "суши": "sushi",
    "роллы": "rolls",
    "ролл": "rolls",

    "дешево": "cheap",
    "недорого": "cheap",
    "дорого": "expensive",
};

// Replace tokens in RU query
export function ruToEnQuery(qNorm) {
    const tokens = (qNorm || "").split(" ").filter(Boolean); // only truly values
    const mapped = tokens.map((t) => RU2EN[t] || t);
    return mapped.join(" ");
}
