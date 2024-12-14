import Gtk from "gi://Gtk"
declare global {
    const START: number
    const CENTER: number
    const END: number
    const FILL: number
    const CONFIG: string
}

Object.assign(globalThis, {
    START: Gtk.Align.START,
    CENTER: Gtk.Align.CENTER,
    END: Gtk.Align.END,
    FILL: Gtk.Align.FILL,
    CONFIG: `${App.configDir}/assets`
})
