import myLocation, { msg, name, getGreeting } from "./myModule";
import add, { subtract as sub } from "./math";

console.log(msg)
console.log(name)
console.log(myLocation)
console.log(getGreeting(name))

console.log(`10 + 5 = ${add(10, 5)}`)
console.log(`10 - 5 = ${sub(10, 5)}`)
