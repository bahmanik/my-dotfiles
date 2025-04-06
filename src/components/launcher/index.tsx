import options from 'src/options';
import PopupWindow from '../shared/PopUp'
import Apps from "gi://AstalApps"
import { icon } from "src/lib/utils"
import { App } from "astal/gtk3"
import AppLauncher from "./AppLauncher"
import { bind, Variable } from 'astal';

export default (): JSX.Element => {
	const revealChild = Variable(true)
	const apps = new Apps.Apps()
	const Applauncher = AppLauncher()

	const favoritesNames = options.launcher.apps.favorites

	const Favorites = () => (
		<revealer reveal_child={bind(revealChild)}
			child={
				<box className="quicklaunch horizontal">{
					favoritesNames(fl => {
						const favoriteApps = fl.map(f => apps.fuzzy_query(f)[0]).filter(f => f)
						return favoriteApps.map((app: Apps.Application) => <button
							onClicked={() => { App.get_window("launcher")!.hide(); app.launch() }}
							child={<icon icon={icon(app.icon_name)} />}
						>
						</button>
						)
					})}
				</box >}
		/>)

	const Entry = () => <entry
		hexpand
		onActivate={({ text }: { text: string }) => {
			if (text?.startsWith(":nx")) { }
			else if (text?.startsWith(":sh")) { }
			else Applauncher.launchFirst()
			App.get_window("launcher")!.hide()
		}}

		onChanged={({ text }: { text: string }) => {
			text ||= ""
			revealChild.set(text === "")
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
				<Favorites />
				{Applauncher}
			</box>
		</PopupWindow>
	);
};

