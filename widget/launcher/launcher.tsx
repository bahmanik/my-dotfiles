import PopupWindows from "../PopupWindows"
import options from "../../options"
export default () => {
    <PopupWindows name="launcher">
        {Favorites()}
    </PopupWindows>
}

function Favorites() {
    const fav = options.launcher.apps.favorites
    return <revealer
        reveal_child={fav(f => f.length)}>
        <box vertical>
            {fav(fs => {
                fs.map(f => {
                    console.log(f)
                })
            })}
            123
            321
        </box>
    </revealer>
}
