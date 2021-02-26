import { Menu, MenuItem, BrowserWindow } from "electron";

export class ContextMenu{

    private mainWindow: BrowserWindow;
    private contextMenu : Menu;

    constructor(mainWindow : BrowserWindow){

        this.mainWindow = mainWindow;
        this.contextMenu = new Menu();
        this.populateContextMenu();

    }

    private populateContextMenu(){

        
        let item = new MenuItem( { label: 'Delete', id: 'Delete'} )
        item.click = () => {this.mainWindow.webContents.send('Delete')}
        this.contextMenu.append(item)

        item = new MenuItem( { label: 'Duplicate', id: 'Duplicate'} )
        item.click = () => {this.mainWindow.webContents.send('Duplicate')}
        this.contextMenu.append(item)
    }

    public showContextMenu(){
        this.contextMenu.popup();
    }

}