export function formatNumber(number) {
    const isNegative = number < 0;
    const positiveNumber = Math.abs(number);
    if (Number.isInteger(number)) {
        const partes = positiveNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return (isNegative ? '-' : '+') + "$" + partes;
    } else {
        const partes = positiveNumber.toFixed(2).toString().split(".");
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return (isNegative ? '-' : '+') + "$" + partes.join(",");
    }
}
