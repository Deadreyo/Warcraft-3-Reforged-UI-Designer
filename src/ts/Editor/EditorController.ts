import { ProjectTree } from './ProjectTree'
import { Editor } from './Editor'

export class EditorController {
    //Application bars
    // static GetDocumentEditor() {
    //     return EditorInit.getInstance().editor
    // }

    /**returns the margin of the 4:3 area. */
    static getInnerMargin(): number {
        const workspace = Editor.getInstance().workspaceImage
        const rect = workspace.getBoundingClientRect()
        return (240 / 1920) * rect.width
    }

    /**returns the margin of the movable area depending on origin mode */
    static getMargin(): number {
        if (ProjectTree.OriginMode === 'consoleui') {
            return 0
        } else {
            return this.getInnerMargin()
        }
    }

    /** gives the max and min numbers for the x-position depending on origin mode*/
    static getMarginLimits(): { min: number; max: number } {
        const workspaceImage = Editor.getInstance().workspaceImage
        if (ProjectTree.OriginMode === 'consoleui') {
            return {
                min: Math.floor(((0 - this.getInnerMargin()) / (workspaceImage.getBoundingClientRect().width - 2 * this.getInnerMargin())) * 800) / 1000,
                max:
                    Math.floor(
                        ((workspaceImage.getBoundingClientRect().right - workspaceImage.getBoundingClientRect().left - this.getInnerMargin()) /
                            (workspaceImage.getBoundingClientRect().width - 2 * this.getInnerMargin())) *
                            800
                    ) / 1000,
            }
        } else {
            return {
                min: 0,
                max: 0.8
            }
            
        }
    }
}
