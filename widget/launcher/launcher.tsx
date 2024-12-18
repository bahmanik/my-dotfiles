import Apps from "gi://AstalApps"
import PopupWindows from "../PopupWindows"
import options from "../../options"
import icon, { icons } from "../../icons/icons"
import { App } from "astal/gtk3"

export default () => {
    <PopupWindows name="launcher">
        <Favorites />
    </PopupWindows>
}

const AppItem = () => { }

const Favorites = () => {
    const apps = new Apps.Apps()
    const fav = options.launcher.apps.favorites

    return <box>
        {fav(fl => {
            fl = fl.map(f => apps.fuzzy_query(f)[0]).filter(f => f)
            return fl.map((app: Apps.Application) => <button
                onClicked={() => { App.get_window("launcher")!.hide(); app.launch() }}>
                <icon icon={icon(app.icon_name, icons.fallback.executable)} />
            </button>
            )
        })
        }
    </box >
}
