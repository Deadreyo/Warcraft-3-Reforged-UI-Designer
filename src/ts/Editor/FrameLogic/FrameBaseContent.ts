import { ipcRenderer } from "electron";
import Saveable from "../../Persistence/Saveable";
import SaveContainer from "../../Persistence/SaveContainer";
import { Editor } from "../Editor";
import { FrameComponent } from "./FrameComponent";
import { ProjectTree } from "../ProjectTree";
import { FrameType } from "./FrameType";

export default abstract class FrameBaseContent implements Saveable {

    public static readonly SAVE_KEY_HEIGHT = "height";
    public static readonly SAVE_KEY_WIDTH = "width";
    public static readonly SAVE_KEY_LEFTX = "leftX";
    public static readonly SAVE_KEY_BOTY = "botY";
    public static readonly SAVE_KEY_TEXT = "text";

    protected readonly frameComponent: FrameComponent;
    protected readonly element: HTMLElement;

    protected width: number;
    protected height: number;
    protected botY: number;
    protected leftX: number;
    protected zIndex: number;
    protected text: string;

    public abstract delete(): void;

    public abstract setText(text: string): void;

    public getText(): string{
        return this.text;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public getFrameComponent(): FrameComponent {
        return this.frameComponent;
    }

    public getZIndex(): number {
        return this.zIndex;
    }

    public setZIndex(zIndex: number): void {

        //this.element.style.zIndex = `${zIndex}`;
        this.zIndex = zIndex;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(newWidth: number, noChange?: boolean): void {
        const workspace = Editor.GetDocumentEditor().workspaceImage
        const rect = workspace.getBoundingClientRect()
        const horizontalMargin = 240 / 1920 * rect.width

        if(!noChange) this.element.style.width = newWidth / 0.8 * (Editor.GetDocumentEditor().workspaceImage.width - 2 * horizontalMargin) + "px";
        this.width = newWidth;

    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(newHeight: number, noChange?: boolean): void {

        const workspace = Editor.GetDocumentEditor().workspaceImage
        const rect = workspace.getBoundingClientRect()
        if(!noChange) {
            //@ts-ignore: element will have height.
            this.element.style.top = `${this.element.offsetTop + this.element.height - newHeight * rect.height / 0.6}px`
            this.element.style.height = `${newHeight / 0.6 * workspace.getBoundingClientRect().height}px`;
        }
        this.height = newHeight
    }

    public getLeftX(): number {
        return this.leftX;
    }

    public setLeftX(newX: number, noChange?: boolean): void {
        const editor = Editor.GetDocumentEditor();
        const rect = editor.workspaceImage.getBoundingClientRect()
        const horizontalMargin = 240 / 1920 * rect.width

        this.leftX = newX;
        if(!noChange) this.element.style.left = `${+newX * (rect.width - 2 * horizontalMargin) / 0.8 + rect.left + horizontalMargin}px`

    }

    public getBotY(): number {
        return this.botY;
    }

    public setBotY(newY: number, noChange?: boolean): void {
        const editor = Editor.GetDocumentEditor();
        const rect = editor.workspaceImage.getBoundingClientRect()

        this.botY = newY;
        //@ts-ignore: Element will have height;
        if(!noChange) this.element.style.top = `${rect.bottom - +newY * rect.height / 0.6 - this.element.offsetHeight - 120}px`

    }

    protected constructor(frameComponent: FrameComponent, element: HTMLElement, text: string, width: number, height: number, x: number, y: number, z: number) {

        this.frameComponent = frameComponent;
        this.element = element;
        Editor.GetDocumentEditor().workspace.appendChild(this.element);

        this.setWidth(width);
        this.setHeight(height);
        this.setLeftX(x);
        this.setBotY(y);
        this.setZIndex(z);
        this.setText(text);

        this.element.draggable = false;
        this.element.style.position = "absolute";
        this.element.style.outlineStyle = "dashed";
        this.element.style.outlineColor = ProjectTree.outlineUnSelected
        this.element.style.outlineOffset = "-3px";

        if(this.frameComponent.type == FrameType.HORIZONTAL_BAR) {
            this.element.style.filter = "brightness(0.6) saturate(0.5)"
        }
        (element as any).frameBaseContent = this;
        
        //step 1: event sent to main.ts to display the menu.
        this.element.oncontextmenu = (ev: Event) => {

            Editor.GetDocumentEditor().projectTree.select(ev.target as HTMLElement);

            ipcRenderer.send('show-context-menu')
        }

    }

    public static GetFrameBaseContentFromHTMLImageElement(htmlElement: HTMLImageElement): FrameBaseContent {
        return (htmlElement as any).frameBaseContent;
    }

    public save(container: SaveContainer): void {
        container.save(FrameBaseContent.SAVE_KEY_HEIGHT, this.height);
        container.save(FrameBaseContent.SAVE_KEY_WIDTH, this.width);
        container.save(FrameBaseContent.SAVE_KEY_LEFTX, this.leftX);
        container.save(FrameBaseContent.SAVE_KEY_BOTY, this.botY);
        container.save(FrameBaseContent.SAVE_KEY_TEXT, this.text);
    }

}
