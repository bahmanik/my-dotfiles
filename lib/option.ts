import { Variable, readFile, writeFile, monitorFile } from "astal"
import { ensureDirectory } from "./utils"
import GLib from "gi://GLib?version=2.0"

type OptProps = {
    persistent?: boolean
}
export class Opt<T = unknown> extends Variable<T> {

    constructor(initial: T, { persistent = false }: OptProps = {}) {
        super(initial)
        this.initial = initial
        this.persistent = persistent
    }

    initial: T
    persistent: boolean
    id = ""

    set = (value: T): T => {
        return super.set(value)
    }
    init(cacheFile: string) {
        const cacheV = JSON.parse(readFile(cacheFile) || "{}")[this.id]
        if (cacheV !== undefined)
            this.set(cacheV)

        this.subscribe(() => {
            const cache = JSON.parse(readFile(cacheFile) || "{}")
            cache[this.id] = this.get()
            writeFile(cacheFile, JSON.stringify(cache, null, 2))
        })
    }

    reset() {
        if (this.persistent)
            return

        if (JSON.stringify(this.get) !== JSON.stringify(this.initial)) {
            this.get = this.initial
            return this.id
        }
    }
}
export const opt = <T>(initial: T, opts?: OptProps) => new Opt(initial, opts)

function getOptions(object: object, path = ""): Opt[] {

    return Object.keys(object).flatMap(key => {
        const obj: Opt = object[key]
        const id = path ? path + "." + key : key
        if (obj instanceof Variable) {
            obj.id = id
            return obj
        }

        if (typeof obj === "object")
            return getOptions(obj, id)

        return []
    })
}

export function mkOptions<T extends object>(cacheFile: string, object: T) {
    for (const opt of getOptions(object))
        opt.init(cacheFile)
    ensureDirectory(cacheFile.split("/").slice(0, -1).join("/"))

    function sleep(ms = 0) {
        return new Promise(r => setTimeout(r, ms))
    }

    async function reset(
        [opt, ...list] = getOptions(object),
        id = opt?.reset(),
    ): Promise<Array<string>> {
        if (!opt)
            return sleep().then(() => [])

        return id
            ? [id, ...(await sleep(50).then(() => reset(list)))]
            : await sleep().then(() => reset(list))
    }

    return Object.assign(object, {
        cacheFile,
        array: () => getOptions(object),
        async reset() {
            return (await reset()).join("\n")
        },
        handler(deps: string[], callback: () => void) {
            for (const opt of getOptions(object)) {
                if (deps.some(i => opt.id.startsWith(i)))
                    opt.subscribe(callback)
            }
        },
    })
}
