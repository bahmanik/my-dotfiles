import options from 'src/options';
import PopupWindow from '../shared/PopUp'
import Apps from "gi://AstalApps"
import { App } from "astal/gtk3"

export default (): JSX.Element => {
	const apps = new Apps.Apps()

	const fav = options.launcher.apps.favorites
	const Favorites = <revealer reveal_child={true}>
		<box class_name="quicklaunch horizontal">{
			fav(fl => {
				fl = fl.map(f => apps.fuzzy_query(f)[0]).filter(f => f)
				return fl.map((app: Apps.Application) => <button
					onClicked={() => { App.get_window("launcher")!.hide(); app.launch() }}>
					<label>{app.icon_name}</label>
				</button>
				)
			})
		}
		</box >
	</revealer>


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

	return (
		<PopupWindow name="launcher">
			<box vertical className="launcher">
				<Entry />
				{Favorites}
			</box>
		</PopupWindow>
	);
};

