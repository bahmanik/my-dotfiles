import { readFile, Variable, writeFileAsync } from "astal"
import FileChooser from "../shared/fileChooser"

type countDown = { uuid: string, name: string }
export default () => {
    const file = "widget/countDown/countDowns.json"
    const list = Variable(JSON.parse(readFile(file)))

    function addCountDown(name: string, description: string, time: number, picture: string) {
        const uuid = "id" + Math.random().toString(16).slice(2)
        console.log(picture.split("/"))
        const content = list.get()
        content[uuid] = { "name": name, "description": description, "time": time, "picture": picture }
        list.set("")
        list.set(content)
        writeFileAsync(file, JSON.stringify(content))
    }

    function deleteCountDown(uuid: string) {
        const content = list.get()
        delete content[uuid]
        list.set("")
        list.set(content)
        writeFileAsync(file, JSON.stringify(content))
    }

    function editUuid(uuid: string, name: string, description: string, time: number, picture: string) {
        const content = list.get()
        content[uuid] = { "name": name, "description": description, "time": time, "picture": picture }
        list.set("")
        list.set(content)
        writeFileAsync(file, JSON.stringify(content))
    }

    const Ename = <entry placeholder-text="name" />
    const Edesc = <entry placeholder-text="description" />
    const Epict = <entry placeholder-text="picture" />
    const Eloca = <entry placeholder-text="picture directory" />
    const year = <entry placeholder-text="year" />
    const month = <entry placeholder-text="month" />
    const day = <entry placeholder-text="day" />
    const hour = <entry placeholder-text="hour" />
    const Form = ({ name }: { name?: string }) => {
        return <box name={name} vertical>
            {[Ename, Edesc, Epict]}
            <box>
                {Eloca}
                <button onClicked={() => { Slides.shown = "fileChooser" }}>
                    icon file
                </button>
            </box>
            <box>
                {[year, month, day, hour]}
            </box>
        </box >
    }
    const Slides = <stack>
        {list(content => Object.keys(content).map((id, num) => {
            return <box
                vertical
                name={`${num}`}
                css={`background-image: url("../background")`}>
                <label label={content[id]["name"]} />
                <label label={content[id]["description"]} />
            </box>
        }))}
        <FileChooser name="fileChooser" onFileActivated={(uri) => {
            Eloca.text = uri.get_filename()
            console.log(uri.uri.get_filename().split("/"))
            Slides.shown = "form"
        }} />
        <Form name="form" />
    </stack>

    return <window>
        <box vertical>
            {Slides}
            <button onClicked={() => { Slides.shown = "form" }}>
                bu
            </button>
        </box>
    </window >
}
