import { Astal, Gtk } from "../../../../../../usr/share/astal/gjs/gtk3"
import icon, { icons } from "../../icons/icons"
import PopupWindows from "../PopupWindows"
import { monitorFile, readFileAsync, Variable, writeFileAsync } from "astal"

export default async () => {

    const taskFile = `widget/taskMenu/task.json`
    const taskComFile = `widget/taskMenu/taskComplete.json`

    const TASKLIST = Variable(await readFileAsync(taskFile).then(content => JSON.parse(content)))
    const TASKCOMPLETE = Variable(await readFileAsync(taskComFile).then(content => JSON.parse(content)))

    async function createTask(desc: string | null,) {
        const uuid = "id" + Math.random().toString(16).slice(2)
        const taskList = await readFileAsync(taskFile)
            .then(content => JSON.parse(content))
            .then(contents => { contents[uuid] = { "state": 1, "desc": desc }; return contents })
            .catch(error => console.log(error))

        writeFileAsync(taskFile, JSON.stringify(taskList))
        TASKLIST.set(taskList)
    }
    async function completeTask(name: string) {

        const taskList = await readFileAsync(taskFile)
            .then(content => JSON.parse(content))
            .then(contents => { contents[name]["state"] = 2; return contents })
            .catch(error => console.log(error))

        TASKLIST.set(taskList)

        const completeList = await readFileAsync(taskComFile)
            .then(content => JSON.parse(content))
            .then(contents => { contents[name] = taskList[name]; return contents })
            .catch(error => console.log(error))

        delete taskList[name]
        writeFileAsync(taskFile, JSON.stringify(taskList)).catch(error => console.log(error))
        writeFileAsync(taskComFile, JSON.stringify(completeList)).catch(error => console.log(error))
    }
    async function undoTask(name: string) {

        const completeList = await readFileAsync(taskComFile)
            .then(content => JSON.parse(content))
            .then(contents => { contents[name]["state"] = 1; return contents })
            .catch(error => console.log(error))

        TASKCOMPLETE.set(completeList)

        const taskList = await readFileAsync(taskFile)
            .then(content => JSON.parse(content))
            .then(contents => { contents[name] = completeList[name]; return contents })
            .catch(error => console.log(error))

        delete completeList[name]
        writeFileAsync(taskFile, JSON.stringify(taskList))
        writeFileAsync(taskComFile, JSON.stringify(completeList))
    }
    async function deleteTask(name: string) {

        const completeList = await readFileAsync(taskComFile)
            .then(content => JSON.parse(content))
            .then(contents => { contents[name]["state"] = 3; return contents })
            .catch(error => console.log(error))

        TASKCOMPLETE.set(completeList)
        delete completeList[name]
        writeFileAsync(taskComFile, JSON.stringify(completeList)).catch(error => console.log(error))
    }

    monitorFile(taskFile, () => {
        setTimeout(() => {
            readFileAsync(taskFile).then(content => TASKLIST.set(JSON.parse(content))
            )
        }, 1000)
    })

    monitorFile(taskComFile, () => {
        setTimeout(() => {
            readFileAsync(taskComFile).then(content => TASKCOMPLETE.set(JSON.parse(content)))
        }, 1000)
    })


    const OngoingTasks = () => {
        return <scrollable
            hexpand
            vexpand
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.NEVER}
        >
            <box vertical className="taskBox">
                {TASKLIST(task => Object.keys(task).map(element => {
                    const { state, desc } = task[element]
                    return <stack
                        class_name="taskStack"
                        transition="over_right"
                        shown={TASKLIST(() => `child${state}`)}
                        transition_duration={1000} >
                        <box name="child1">
                            <label hexpand label={`  ${desc} `} />
                            <button className="task" on_clicked={() => {
                                completeTask(element)
                            }}>
                                <icon icon={icon(icons.ui.tick)} />
                            </button>
                        </box>
                        <box name="child2"
                            class_name="taskComplete">
                            <label label="complete" hexpand />
                        </box>
                    </stack>
                })
                )}
            </box >
        </scrollable>
    }
    const CompleteTasks = () => {
        return <scrollable
            vexpand
            hexpand
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.NEVER}
            className="tets"
        >
            <box vertical className="tets">
                {TASKCOMPLETE(task => Object.keys(task).map(element => {
                    const { state, desc } = task[element]
                    return <stack
                        class_name="taskStack"
                        transition="over_right"
                        shown={TASKLIST(() => `child${state}`)}
                        transition_duration={1000} >
                        <box name="child1" class_name="taskComplete">
                            <label label="undo" hexpand use_underline />
                        </box>
                        <box name="child2">
                            <button class_name="task" on_clicked={() => { undoTask(element) }} ><icon icon={icon(icons.ui.arrow_u)} /></button>
                            <label label={`  ${desc} `} hpack="start" hexpand />
                            <button class_name="task" on_clicked={() => { deleteTask(element) }} >{<icon icon={icons.trash.empty} />}</button>
                        </box>
                        <box name="child3" class_name="taskComplete">
                            <label label="delete" hexpand use_underline />
                        </box>
                    </stack>
                })
                )}
            </box >
        </scrollable >
    }

    const TaskEntry = () => {
        return <entry
            setup={(self) => {
                self.connect('activate', () => {
                    self.text == "" ? {} : createTask(self.text)
                    self.text = ""
                })
            }}
            class_name="taskEntry" />
    }

    return <PopupWindows
        name="taskMenu"
        class_name="taskWindow"
        //exclusivity="normal"
        //transition="slide_right"
        layout="center" >
        <box class_name="taskBody">
            <box vertical>
                <label label="Ongoning" class_name="title" />
                <OngoingTasks />
                <TaskEntry />
            </box>
            <box vertical>
                <label label="Complete" class_name="title" />
                <CompleteTasks />
            </box>
        </box>
    </PopupWindows >
}
