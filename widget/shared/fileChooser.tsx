import GObject from "gi://GObject"
import { Gtk, Gdk, Widget, astalify, type ConstructProps } from "astal/gtk3"

export default class fileChooser extends astalify(Gtk.FileChooserWidget) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        fileChooser,
        Gtk.FileChooserWidget.ConstructorProps,
        { fileActivated: [] } // signals of Gtk.ColorButton have to be manually typed
    >) {
        super(props as any)
    }
}
