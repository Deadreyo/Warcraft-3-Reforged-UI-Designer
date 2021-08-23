import { remote, SaveDialogReturnValue } from "electron";
import { writeFile } from "original-fs";
import { ICallableDivInstance } from "../Classes & Functions/ICallableDivInstance";
import { Editor } from "../Editor/Editor";
import SaveContainer from "./SaveContainer";
import { ProjectTree } from "../Editor/ProjectTree";

export default class SaveDocument implements ICallableDivInstance {

    public save(filepath: string): void {
        try {

            const data = new SaveContainer(null);
            Editor.GetDocumentEditor().projectTree.save(data);

            writeFile(filepath, data.exportToJSON(), (err) => {
                if (err != null) {
                    console.error("Failed saving file: " + err.message);
                }
            });
        } catch (e) { alert('Save: ' + e) }
    }

    public run(): void {

        ProjectTree.saveGeneralOptions();

        const saveParams = remote.dialog.showSaveDialog({
            filters: [{ name: 'JSON', extensions: ['json'] }],
            properties: ['createDirectory']
        });

        saveParams.then((saveData: SaveDialogReturnValue) => {

            if (saveData.canceled) return;
            this.save(saveData.filePath)

        });

    }

}