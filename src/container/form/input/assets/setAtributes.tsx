import { InputInterface } from "./input.interface"

export const SetAtributes = (initial: InputInterface) => {
    var subAtributes: InputInterface
    subAtributes = JSON.parse(JSON.stringify(initial))
    return subAtributes
}