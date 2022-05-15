const Expression = new RegExp("^(([A-Za-z0-9]+@|http(|s)\\:\\/\\/)|(http(|s)\\:\\/\\/[A-Za-z0-9]+@))([A-Za-z0-9.]+(:\\d+)?)(?::|\\/)([\\d\\/\\w.-]+?)(\\.git){1}$", "gi");

export { Expression };
export default Expression;
