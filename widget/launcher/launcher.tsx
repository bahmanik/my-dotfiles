import Apps from "gi://AstalApps"
import PopupWindows from "../PopupWindows"
import options from "../../options"
import icon, { icons } from "../../icons/icons"
import { App } from "astal/gtk3"
import AppLauncher from "./AppLauncher"

export default () => {
    const apps = new Apps.Apps()
    const Applauncher = AppLauncher()

    const Entry = () => <entry
        hexpand
        onActivate={({ text }: { text: string }) => {
            if (text?.startsWith(":nx")) { }
            else if (text?.startsWith(":sh")) { }
            else
                Applauncher.launchFirst()
            App.get_window("launcher")!.hide()
        }}

        onChanged={({ text }: { text: string }) => {
            text ||= ""
            Favorites.revealChild = text === ""
            if (text?.startsWith(":nx")) { }
            else { }
            if (text?.startsWith(":sh")) { }
            else { }
            if (!text?.startsWith(":")) {
                Applauncher.filter(text)
            }
        }}

        setup={self => {
            App.connect('window-toggled', () => {
                self.grab_focus()
                self.text = ""
            });
        }}
    />

    const fav = options.launcher.apps.favorites
    const Favorites = <revealer reveal_child={true}>
        <box>{
            fav(fl => {
                fl = fl.map(f => apps.fuzzy_query(f)[0]).filter(f => f)
                return fl.map((app: Apps.Application) => <button
                    onClicked={() => { App.get_window("launcher")!.hide(); app.launch() }}>
                    <icon icon={icon(app.icon_name, icons.fallback.executable)} />
                </button>
                )
            })
        }
        </box >
    </revealer>

    return <PopupWindows name="launcher">
        <box vertical>
            <Entry />
            {Favorites}
            {Applauncher}
        </box>
    </PopupWindows>
}
